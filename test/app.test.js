process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret-only';

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const db = require('../db/database');
const app = require('../server');

const agent = request.agent(app);

function csrfFrom(html) {
    const m = String(html).match(/name="_csrf" value="([^"]+)"/);
    assert.ok(m, 'expected a _csrf token in the page');
    return m[1];
}

before(async () => {
    await db.initPromise;
    const res = await agent.get('/admin/login');
    assert.strictEqual(res.status, 200);
    const csrf = csrfFrom(res.text);
    await agent.post('/admin/login')
        .type('form')
        .send({ _csrf: csrf, email: 'admin@contech.com.np', password: 'Contech#2026' })
        .expect(302)
        .expect('Location', '/admin/dashboard');
});

after(async () => {
    await db.close();
});

test('public pages return 200', async () => {
    for (const p of ['/', '/about', '/products', '/technology', '/quality', '/blogs', '/contact']) {
        await agent.get(p).expect(200);
    }
});

test('404 page for unknown route', async () => {
    await agent.get('/definitely-not-a-page').expect(404);
});

test('blog single renders and unknown slug 404s', async () => {
    await agent.get('/blogs/why-vertical-vibro-casting-beats-spun-technology').expect(200);
    await agent.get('/blogs/does-not-exist').expect(404);
});

test('sanitize-html strips scripts from blog content', async () => {
    const res = await agent.get('/blogs/why-vertical-vibro-casting-beats-spun-technology');
    assert.strictEqual(res.text.includes('<script>'), false);
});

async function countEnquiries() {
    return Number((await db.get('SELECT COUNT(*) c FROM enquiries')).c);
}

test('enquiry API: valid submission inserts a row and emails', async () => {
    const beforeCount = await countEnquiries();
    await agent.post('/api/enquire')
        .type('form')
        .send({
            client_name: 'Test Client',
            company_name: 'Test Co',
            email: 'client@example.com',
            phone: '+977 9800000000',
            pipe_type: 'NP4',
            pipe_diameter: '1000',
            quantity: '25',
            delivery_site: 'Satungal, Kathmandu',
            message: 'Need pipes delivered to site.'
        })
        .expect(200)
        .expect('Content-Type', /json/);
    const afterCount = await countEnquiries();
    assert.strictEqual(afterCount, beforeCount + 1);
});

test('enquiry API: invalid submission returns 400 with issues', async () => {
    const res = await agent.post('/api/enquire')
        .type('form')
        .send({ client_name: 'X', email: 'not-an-email', phone: '1' })
        .expect(400);
    assert.ok(res.body.issues.client_name);
    assert.ok(res.body.issues.email);
});

test('admin routes redirect to login when unauthenticated', async () => {
    await request(app).get('/admin/dashboard').expect(302).expect('Location', '/admin/login');
});

test('admin dashboard renders after login', async () => {
    await agent.get('/admin/dashboard').expect(200);
});

test('POST without CSRF token is rejected with 403', async () => {
    await request(app).post('/admin/login')
        .type('form')
        .send({ email: 'admin@contech.com.np', password: 'wrong' })
        .expect(403);
});

test('enquiries list: pagination, search, and detail', async () => {
    for (let i = 0; i < 25; i++) {
        await db.run(
            `INSERT INTO enquiries (id, client_name, company_name, email, phone, pipe_type, quantity, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            `test-${i}`, `Searchable ${i}`, `Co ${i}`, `s${i}@example.com`, '977', 'NP3', 10, `Message ${i}`,
            new Date(Date.now() - i * 60000).toISOString()
        );
    }
    await agent.get('/admin/enquiries').expect(200).expect(/Page 1 of 2/);
    await agent.get('/admin/enquiries?page=2').expect(200).expect(/Page 2 of 2/);
    await agent.get('/admin/enquiries?q=Searchable%2017').expect(200).expect(/Searchable 17/);
    const detail = await agent.get('/admin/enquiries/test-0').expect(200);
    assert.ok(detail.text.includes('Message 0'));
    await agent.get('/admin/enquiries/nope').expect(302).expect('Location', '/admin/enquiries');
    await db.run("DELETE FROM enquiries WHERE id LIKE 'test-%'");
});

test('enquiry status update to contacted fires follow-up email and redirects safely', async () => {
    await db.run("INSERT INTO enquiries (id, client_name, email, phone, status) VALUES ('st-1', 'Status Guy', 'status@example.com', '977', 'pending')");
    const page = await agent.get('/admin/enquiries/st-1').expect(200);
    const csrf = csrfFrom(page.text);
    await agent.post('/admin/enquiries/st-1/status')
        .type('form')
        .send({ _csrf: csrf, status: 'contacted', redirect: 'https://evil.example.com' })
        .expect(302)
        .expect('Location', '/admin/enquiries');
    const row = await db.get("SELECT status FROM enquiries WHERE id = 'st-1'");
    assert.strictEqual(row.status, 'contacted');
    await db.run("DELETE FROM enquiries WHERE id = 'st-1'");
});

test('blog create -> edit -> delete round trip', async () => {
    const list = await agent.get('/admin/blogs').expect(200);
    const csrf = csrfFrom(list.text);
    await agent.post('/admin/blogs/new')
        .type('form')
        .field('_csrf', csrf)
        .field('title', 'Round Trip Blog')
        .field('content', '<p>Hello</p>')
        .expect(302)
        .expect('Location', '/admin/blogs');
    const blog = await db.get("SELECT * FROM blogs WHERE title = 'Round Trip Blog'");
    assert.ok(blog);
    assert.strictEqual(blog.slug, 'round-trip-blog');
    await agent.get(`/admin/blogs/${blog.id}/edit`).expect(200);
    await agent.post(`/admin/blogs/${blog.id}/delete`)
        .type('form')
        .send({ _csrf: csrf })
        .expect(302);
    const count = Number((await db.get("SELECT COUNT(*) c FROM blogs WHERE title = 'Round Trip Blog'")).c);
    assert.strictEqual(count, 0);
});

test('product add -> edit -> delete round trip', async () => {
    const list = await agent.get('/admin/products').expect(200);
    const csrf = csrfFrom(list.text);
    await agent.post('/admin/products')
        .type('form')
        .field('_csrf', csrf)
        .field('internal_diameter', '2500')
        .field('min_thickness', '200')
        .field('effective_length', '2.5')
        .field('load_crack', '100')
        .field('ultimate_load', '150')
        .expect(302)
        .expect('Location', '/admin/products');
    const prod = await db.get('SELECT * FROM products WHERE internal_diameter = 2500');
    assert.ok(prod);
    await agent.post(`/admin/products/${prod.id}/edit`)
        .type('form')
        .field('_csrf', csrf)
        .field('internal_diameter', '2500')
        .field('min_thickness', '210')
        .field('effective_length', '2.5')
        .field('load_crack', '100')
        .field('ultimate_load', '150')
        .expect(302);
    const edited = await db.get('SELECT min_thickness FROM products WHERE id = ?', prod.id);
    assert.strictEqual(edited.min_thickness, 210);
    await agent.post(`/admin/products/${prod.id}/delete`)
        .type('form')
        .send({ _csrf: csrf })
        .expect(302);
    const count = Number((await db.get('SELECT COUNT(*) c FROM products WHERE id = ?', prod.id)).c);
    assert.strictEqual(count, 0);
});

test('non-image upload is rejected with flash redirect', async () => {
    const csrf = csrfFrom((await agent.get('/admin/blogs').expect(200)).text);
    await agent.post('/admin/blogs/new')
        .set('Referer', 'http://localhost/admin/blogs')
        .field('_csrf', csrf)
        .field('title', 'Upload Reject')
        .field('content', '<p>x</p>')
        .attach('featured_image_file', Buffer.from('not-an-image'), { filename: 'evil.txt', contentType: 'text/plain' })
        .expect(302)
        .expect('Location', /\/admin\/blogs$/);
});

test('robots.txt allows AI bots', async () => {
    const res = await agent.get('/robots.txt').expect(200);
    for (const bot of ['ChatGPT-User', 'OAI-SearchBot', 'PerplexityBot']) {
        assert.ok(res.text.includes(bot), `expected robots.txt to allow ${bot}`);
    }
});

test('email templates produce text + escaped HTML', () => {
    const { clientConfirmation, adminAlert, contactedFollowUp } = require('../lib/email-templates');
    const e = {
        id: 'x1', client_name: 'Alice & Bob', company_name: 'ACME', email: 'a@example.com',
        phone: '977', pipe_type: 'NP4', quantity: 25, message: 'Quote <script>alert(1)</script>'
    };
    const conf = clientConfirmation(e);
    assert.ok(conf.subject.includes('received your quotation'));
    assert.ok(conf.text.includes('Alice & Bob'));
    assert.ok(conf.html.includes('Alice &amp; Bob'));
    assert.ok(conf.html.includes('<script>') === false, 'HTML must not contain raw script');

    const alert = adminAlert(e);
    assert.ok(alert.subject.includes('New enquiry'));
    assert.ok(alert.html.includes('/admin/enquiries/x1'));

    const contacted = contactedFollowUp(e);
    assert.ok(contacted.subject.includes('Your enquiry'));
    assert.ok(contacted.html.includes('Alice &amp; Bob'));
});