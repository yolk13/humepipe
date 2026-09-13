const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sanitizeHtmlLib = require('sanitize-html');
const { z } = require('zod');
const { v4: uuidv4 } = require('uuid');
const db = require('./db/database');
const seed = require('./db/seed');
const SessionStore = require('./db/session-store');
const site = require('./config/site');
const { upload, storeUpload, removeUpload, uploadErrorHandler } = require('./lib/upload');
const { sendMail } = require('./lib/mailer');
const { clientConfirmation, adminAlert, contactedFollowUp } = require('./lib/email-templates');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;
const sessionSecret = process.env.SESSION_SECRET || 'contech-dev-secret-change-me';
if (!process.env.SESSION_SECRET) {
    console.warn('WARNING: SESSION_SECRET not set. Using insecure default. Set SESSION_SECRET in .env for production.');
}

const seedPromise = seed().catch(err => console.error('[seed]', err.message));

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '200kb' }));
app.use(bodyParser.json({ limit: '200kb' }));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https://*.public.blob.vercel-storage.com'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            frameAncestors: ["'none'"],
            formAction: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(session({
    name: 'contech.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new SessionStore(db)
}));

async function ensureReady(req, res, next) {
    try { await seedPromise; } catch (err) { console.error('[seed] failed during request:', err.message); }
    next();
}

app.use(ensureReady);

// CSRF protection for admin routes
function ensureCsrf(req, res, next) {
    if (!req.session.csrf) {
        req.session.csrf = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrf = req.session.csrf;
    next();
}

function verifyCsrf(req, res, next) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const token = req.body && req.body._csrf;
        if (!token || token !== req.session.csrf) {
            return res.status(403).send('Invalid CSRF token. Go back and try again.');
        }
    }
    next();
}

app.use('/admin', ensureCsrf);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    res.locals.currentPath = req.path;
    res.locals.site = site;
    res.locals.listQueryString = listQueryString;
    res.locals.sanitizeHtml = (html) => sanitizeHtmlLib(html || '', {
        allowedTags: ['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'img', 'blockquote', 'br', 'code', 'pre'],
        allowedAttributes: {
            a: ['href', 'target', 'rel'],
            img: ['src', 'alt', 'title']
        },
        allowedSchemes: ['http', 'https', 'mailto']
    });
    next();
});

function requireAuth(req, res, next) {
    if (req.session.user) return next();
    return res.redirect('/admin/login');
}

function setFlash(type, text) {
    return (req, res) => {
        req.session.flash = { type, text };
    };
}

function slugify(s) {
    return s.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function blogCount() {
    return db.get('SELECT COUNT(*) AS c FROM blogs').then(r => Number(r.c));
}

function enquiryCounts() {
    return db.get(`
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed,
            SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS contacted
        FROM enquiries
    `).then(r => ({
        total: Number(r.total),
        pending: Number(r.pending),
        reviewed: Number(r.reviewed),
        contacted: Number(r.contacted)
    }));
}

const adminEmail = () => process.env.ADMIN_EMAIL || site.email;

async function sendEnquiryEmails(enquiry) {
    await sendMail({ to: enquiry.email, ...clientConfirmation(enquiry) });
    await sendMail({ to: adminEmail(), ...adminAlert(enquiry) });
}

function sendContactedEmail(enquiry) {
    return sendMail({ to: enquiry.email, ...contactedFollowUp(enquiry) });
}

// ===== Public Routes =====

app.get('/', (req, res) => {
    res.render('index', {
        jsonld: {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'Organization',
                    name: 'Contech Concrete and Allied Industries Pvt. Ltd.',
                    description: 'Manufacturer, Exporter, and Supplier of RCC Concrete Pipes in Nepal.',
                    address: { '@type': 'PostalAddress', addressLocality: 'Satungal, Kathmandu', addressCountry: 'NP' },
                    foundingDate: '2014',
                    url: `${req.protocol}://${req.get('host')}`
                },
                {
                    '@type': 'Product',
                    name: 'RCC Concrete Pipes (NP3 & NP4)',
                    description: 'IS 458:2003 compliant RCC concrete pipes from 600mm to 2000mm internal diameter.',
                    brand: { '@type': 'Brand', name: 'Contech Concrete' }
                }
            ]
        },
        meta: {
            title: 'Contech Concrete | RCC Concrete Pipe Manufacturer in Kathmandu, Nepal',
            description: 'Contech Concrete and Allied Industries Pvt. Ltd. manufactures, exports and supplies IS 458:2003 RCC concrete pipes (600mm–2000mm) using vertical vibro casting in Kathmandu, Nepal.'
        }
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        meta: {
            title: 'About Us - Contech Concrete',
            description: 'Established in 2014, CCAI Pipe Industries is a joint venture of Contech Pvt Ltd manufacturing premium RCC concrete pipes in Satungal, Kathmandu.'
        }
    });
});

app.get('/products', async (req, res) => {
    const products = await db.all('SELECT * FROM products ORDER BY internal_diameter');
    res.render('products', {
        products,
        jsonld: {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'Organization',
                    name: 'Contech Concrete and Allied Industries Pvt. Ltd.',
                    url: `${req.protocol}://${req.get('host')}`
                },
                {
                    '@type': 'Table',
                    about: 'IS 458:2003 RCC concrete pipe specifications',
                    'cssSelector': '#spec-table'
                }
            ]
        },
        meta: {
            title: 'Product Specifications - Contech Concrete',
            description: 'NP3 and NP4 RCC concrete pipes from 600mm to 2000mm internal diameter, manufactured to IS 458:2003. Full technical specification table.'
        }
    });
});

app.get('/technology', (req, res) => {
    res.render('technology', {
        meta: {
            title: 'Technology & Manufacturing - Contech Concrete',
            description: 'Vertical vibro casting manufacturing process with automated Apollo Hawk-eye Pedershaap batching plant for superior RCC pipes.'
        }
    });
});

app.get('/quality', (req, res) => {
    res.render('quality', {
        jsonld: {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${req.protocol}://${req.get('host')}/` },
                { '@type': 'ListItem', position: 2, name: 'Quality Assurance', item: `${req.protocol}://${req.get('host')}/quality` }
            ]
        },
        meta: {
            title: 'Quality Assurance - Contech Concrete',
            description: 'Contech Concrete follows strict quality checks from raw material examination to final testing: three edge bearing load tests and hydro tests on every batch per IS 458:2003.'
        }
    });
});

app.get('/blogs', async (req, res) => {
    const blogs = await db.all('SELECT * FROM blogs ORDER BY published_at DESC');
    res.render('blogs', {
        blogs,
        meta: {
            title: 'Blogs & News - Contech Concrete',
            description: 'Latest news, technical articles and insights from Contech Concrete and Allied Industries on RCC pipe manufacturing.'
        }
    });
});

app.get('/blogs/:slug', async (req, res) => {
    const blog = await db.get('SELECT * FROM blogs WHERE slug = ?', req.params.slug);
    if (!blog) return res.status(404).render('404', {
        meta: { title: 'Not Found - Contech Concrete', description: 'Page not found.' }
    });
    res.render('blog-single', {
        blog,
        meta: {
            title: blog.meta_title || blog.title,
            description: blog.meta_description || `Read: ${blog.title}`,
            type: 'article'
        }
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        meta: {
            title: 'Request Quotation - Contech Concrete',
            description: 'Request a quotation for RCC concrete pipes. Send your pipe specifications and requirements to Contech Concrete.'
        }
    });
});

// ===== Enquiry API =====

const enquirySchema = z.object({
    client_name: z.string().min(2, 'Please enter your name'),
    company_name: z.string().optional().default(''),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().min(7, 'Enter a valid phone number'),
    pipe_type: z.string().optional().default(''),
    pipe_diameter: z.string().optional().default(''),
    quantity: z.coerce.number().int().positive().optional().default(0),
    delivery_site: z.string().min(2, 'Enter the delivery site location'),
    message: z.string().optional().default('')
});

const enquireLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: { error: 'Too many requests. Please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
        validate: { trustProxy: false }
    });

app.post('/api/enquire', enquireLimiter, async (req, res) => {
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) {
        const issues = {};
        parsed.error.issues.forEach(i => { issues[i.path[0]] = i.message; });
        return res.status(400).json({ error: 'Validation failed', issues });
    }

    const { client_name, company_name, email, phone, pipe_type, pipe_diameter, quantity, delivery_site, message } = parsed.data;
    const id = uuidv4();
    try {
        await db.run(
            `INSERT INTO enquiries (id, client_name, company_name, email, phone, pipe_type, pipe_diameter, quantity, delivery_site, message, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            id, client_name, company_name, email, phone, pipe_type, pipe_diameter, quantity || null, delivery_site, message
        );
        res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });
        const enquiry = { id, client_name, company_name, email, phone, pipe_type, pipe_diameter, quantity, delivery_site, message };
        sendEnquiryEmails(enquiry).catch(err => console.error('[mail] enquiry emails failed:', err.message));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit enquiry' });
    }
});

// ===== Admin Auth =====

app.get('/admin/login', (req, res) => {
    if (req.session.user) return res.redirect('/admin/dashboard');
    res.render('admin/login', {
        meta: { title: 'Admin Login - Contech Concrete', description: 'Admin login.' }
    });
});

app.post('/admin/login', verifyCsrf, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.session.flash = { type: 'error', text: 'Email and password are required.' };
        return res.redirect('/admin/login');
    }
    const user = await db.get('SELECT * FROM users WHERE email = ?', String(email).toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        req.session.flash = { type: 'error', text: 'Invalid credentials.' };
        return res.redirect('/admin/login');
    }
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.redirect('/admin/dashboard');
});

app.post('/admin/logout', verifyCsrf, (req, res) => {
    req.session.destroy(() => res.redirect('/admin/login'));
});

app.get('/admin', requireAuth, (req, res) => res.redirect('/admin/dashboard'));

app.get('/admin/dashboard', requireAuth, async (req, res) => {
    const [counts, recent, blogsCount] = await Promise.all([
        enquiryCounts(),
        db.all('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 8'),
        blogCount()
    ]);
    res.render('admin/dashboard', {
        counts,
        recent,
        blogsCount,
        meta: { title: 'Dashboard - Contech Admin', description: 'Admin dashboard.' }
    });
});

// ===== Admin: Blogs CRUD =====

app.get('/admin/blogs', requireAuth, async (req, res) => {
    const blogs = await db.all('SELECT id, title, slug, published_at FROM blogs ORDER BY published_at DESC');
    res.render('admin/blogs', {
        blogs,
        meta: { title: 'Blogs - Contech Admin', description: 'Manage blogs.' }
    });
});

app.get('/admin/blogs/new', requireAuth, (req, res) => {
    res.render('admin/blog-form', {
        blog: null,
        meta: { title: 'New Blog - Contech Admin', description: 'Create a blog.' }
    });
});

app.post('/admin/blogs/new', requireAuth, upload.single('featured_image_file'), verifyCsrf, async (req, res) => {
    const { title, slug, content, meta_title, meta_description } = req.body;
    if (!title) {
        req.session.flash = { type: 'error', text: 'Title is required.' };
        return res.redirect('/admin/blogs/new');
    }
    const finalSlug = slug || slugify(title);
    const existing = await db.get('SELECT id FROM blogs WHERE slug = ?', finalSlug);
    if (existing) {
        req.session.flash = { type: 'error', text: 'A blog with this slug already exists.' };
        return res.redirect('/admin/blogs/new');
    }
    const featured_image = req.file
        ? await storeUpload(req.file.buffer, req.file.mimetype)
        : (req.body.featured_image || '');
    await db.run(
        `INSERT INTO blogs (id, title, slug, content, meta_title, meta_description, featured_image, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        uuidv4(), title, finalSlug, content || '', meta_title || '', meta_description || '', featured_image, new Date().toISOString()
    );
    req.session.flash = { type: 'success', text: 'Blog created.' };
    res.redirect('/admin/blogs');
});

app.get('/admin/blogs/:id/edit', requireAuth, async (req, res) => {
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', req.params.id);
    if (!blog) {
        req.session.flash = { type: 'error', text: 'Blog not found.' };
        return res.redirect('/admin/blogs');
    }
    res.render('admin/blog-form', {
        blog,
        meta: { title: 'Edit Blog - Contech Admin', description: 'Edit a blog.' }
    });
});

app.post('/admin/blogs/:id/edit', requireAuth, upload.single('featured_image_file'), verifyCsrf, async (req, res) => {
    const { title, slug, content, meta_title, meta_description } = req.body;
    if (!title) {
        req.session.flash = { type: 'error', text: 'Title is required.' };
        return res.redirect(`/admin/blogs/${req.params.id}/edit`);
    }
    const finalSlug = slug || slugify(title);
    const clash = await db.get('SELECT id FROM blogs WHERE slug = ? AND id != ?', finalSlug, req.params.id);
    if (clash) {
        req.session.flash = { type: 'error', text: 'A blog with this slug already exists.' };
        return res.redirect(`/admin/blogs/${req.params.id}/edit`);
    }
    const current = await db.get('SELECT featured_image FROM blogs WHERE id = ?', req.params.id);
    const featured_image = req.file
        ? await storeUpload(req.file.buffer, req.file.mimetype)
        : (req.body.featured_image || (current && current.featured_image) || '');
    await db.run(
        `UPDATE blogs SET title = ?, slug = ?, content = ?, meta_title = ?, meta_description = ?, featured_image = ?
        WHERE id = ?`,
        title, finalSlug, content || '', meta_title || '', meta_description || '', featured_image, req.params.id
    );
    if (req.file) removeUpload(current && current.featured_image);
    req.session.flash = { type: 'success', text: 'Blog updated.' };
    res.redirect('/admin/blogs');
});

app.post('/admin/blogs/:id/delete', requireAuth, verifyCsrf, async (req, res) => {
    const blog = await db.get('SELECT featured_image FROM blogs WHERE id = ?', req.params.id);
    await db.run('DELETE FROM blogs WHERE id = ?', req.params.id);
    removeUpload(blog && blog.featured_image);
    req.session.flash = { type: 'success', text: 'Blog deleted.' };
    res.redirect('/admin/blogs');
});

// ===== Admin: Products CRUD =====

app.get('/admin/products', requireAuth, async (req, res) => {
    const products = await db.all('SELECT * FROM products ORDER BY internal_diameter');
    res.render('admin/products', {
        products,
        meta: { title: 'Products - Contech Admin', description: 'Manage products.' }
    });
});

app.post('/admin/products', requireAuth, upload.single('image'), verifyCsrf, async (req, res) => {
    const { internal_diameter, min_thickness, effective_length, load_crack, ultimate_load, type } = req.body;
    if (!internal_diameter || !min_thickness || !effective_length || !load_crack || !ultimate_load) {
        req.session.flash = { type: 'error', text: 'All specification fields are required.' };
        return res.redirect('/admin/products');
    }
    const image = req.file ? await storeUpload(req.file.buffer, req.file.mimetype) : '';
    await db.run(
        `INSERT INTO products (id, internal_diameter, min_thickness, effective_length, load_crack, ultimate_load, type, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        uuidv4(), Number(internal_diameter), Number(min_thickness), Number(effective_length), Number(load_crack), Number(ultimate_load), type || 'NP3/NP4', image
    );
    req.session.flash = { type: 'success', text: 'Product added.' };
    res.redirect('/admin/products');
});

app.post('/admin/products/:id/edit', requireAuth, upload.single('image'), verifyCsrf, async (req, res) => {
    const { internal_diameter, min_thickness, effective_length, load_crack, ultimate_load, type } = req.body;
    if (!internal_diameter || !min_thickness || !effective_length || !load_crack || !ultimate_load) {
        req.session.flash = { type: 'error', text: 'All specification fields are required.' };
        return res.redirect('/admin/products');
    }
    const current = await db.get('SELECT image FROM products WHERE id = ?', req.params.id);
    const image = req.file ? await storeUpload(req.file.buffer, req.file.mimetype) : (req.body.image || current && current.image || '');
    await db.run(
        `UPDATE products SET internal_diameter = ?, min_thickness = ?, effective_length = ?, load_crack = ?, ultimate_load = ?, type = ?, image = ?
        WHERE id = ?`,
        Number(internal_diameter), Number(min_thickness), Number(effective_length), Number(load_crack), Number(ultimate_load), type || 'NP3/NP4', image, req.params.id
    );
    if (req.file) removeUpload(current && current.image);
    req.session.flash = { type: 'success', text: 'Product updated.' };
    res.redirect('/admin/products');
});

app.post('/admin/products/:id/delete', requireAuth, verifyCsrf, async (req, res) => {
    const product = await db.get('SELECT image FROM products WHERE id = ?', req.params.id);
    await db.run('DELETE FROM products WHERE id = ?', req.params.id);
    removeUpload(product && product.image);
    req.session.flash = { type: 'success', text: 'Product deleted.' };
    res.redirect('/admin/products');
});

// ===== Admin: Enquiries =====

const ENQUIRIES_PER_PAGE = 20;

function enquiriesQuery({ status, q }) {
    const clauses = [];
    const params = [];
    if (status !== 'all') {
        clauses.push('status = ?');
        params.push(status);
    }
    if (q) {
        const like = `%${q}%`;
        clauses.push('(client_name LIKE ? OR company_name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)');
        params.push(like, like, like, like, like);
    }
    return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

app.get('/admin/enquiries', requireAuth, async (req, res) => {
    const status = ['pending', 'reviewed', 'contacted'].includes(req.query.status) ? req.query.status : 'all';
    const q = (req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const { where, params } = enquiriesQuery({ status, q });

    const total = Number((await db.get(`SELECT COUNT(*) AS c FROM enquiries ${where}`, ...params)).c);
    const totalPages = Math.max(1, Math.ceil(total / ENQUIRIES_PER_PAGE));
    const current = Math.min(page, totalPages);
    const offset = (current - 1) * ENQUIRIES_PER_PAGE;

    const enquiries = await db.all(
        `SELECT * FROM enquiries ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
        ...params, ENQUIRIES_PER_PAGE, offset
    );

    res.render('admin/enquiries', {
        enquiries,
        status,
        q,
        page: current,
        totalPages,
        total,
        perPage: ENQUIRIES_PER_PAGE,
        counts: enquiryCounts(),
        meta: { title: 'Enquiries - Contech Admin', description: 'Manage enquiries.' }
    });
});

function listQueryString({ status, q, page }) {
    const p = new URLSearchParams();
    if (status && status !== 'all') p.set('status', status);
    if (q) p.set('q', q);
    if (page && page > 1) p.set('page', page);
    return p.toString();
}

app.get('/admin/enquiries/:id', requireAuth, async (req, res) => {
    const enquiry = await db.get('SELECT * FROM enquiries WHERE id = ?', req.params.id);
    if (!enquiry) {
        req.session.flash = { type: 'error', text: 'Enquiry not found.' };
        return res.redirect('/admin/enquiries');
    }
    res.render('admin/enquiry-detail', {
        enquiry,
        query: req.query,
        meta: { title: `Enquiry - ${enquiry.client_name} - Contech Admin`, description: 'Enquiry detail.' }
    });
});

app.post('/admin/enquiries/:id/status', requireAuth, verifyCsrf, async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'reviewed', 'contacted'].includes(status)) {
        req.session.flash = { type: 'error', text: 'Invalid status.' };
        return res.redirect('/admin/enquiries');
    }
    await db.run('UPDATE enquiries SET status = ? WHERE id = ?', status, req.params.id);
    if (status === 'contacted') {
        const enquiry = await db.get('SELECT * FROM enquiries WHERE id = ?', req.params.id);
        if (enquiry) {
            sendContactedEmail(enquiry).catch(err => console.error('[mail] contacted email failed:', err.message));
        }
    }
    const redirect = String(req.body.redirect || '/admin/enquiries');
    req.session.flash = { type: 'success', text: 'Enquiry status updated.' };
    res.redirect(redirect.startsWith('/admin/enquiries') ? redirect : '/admin/enquiries');
});

// ===== Upload error handling =====

app.use(uploadErrorHandler);

// ===== 404 =====

app.use((req, res) => {
    res.status(404).render('404', {
        meta: { title: 'Not Found - Contech Concrete', description: 'Page not found.' }
    });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

module.exports = app;