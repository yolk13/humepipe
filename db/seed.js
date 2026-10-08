const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('./database');

const products = [
    [600, 75, 2.5, 28.74, 43.11],
    [700, 85, 2.5, 33.53, 50.30],
    [800, 95, 2.5, 38.32, 57.48],
    [900, 100, 2.5, 43.11, 64.67],
    [1000, 115, 2.5, 47.90, 71.85],
    [1100, 120, 2.5, 52.69, 79.00],
    [1200, 125, 2.5, 57.48, 86.22],
    [1400, 140, 2.5, 67.06, 100.60],
    [1600, 165, 2.5, 76.64, 114.96],
    [1800, 180, 2.5, 86.22, 129.33],
    [2000, 190, 2.5, 95.80, 143.70]
];

const blogs = [
    {
        title: 'Why Vertical Vibro Casting Beats Spun Technology',
        slug: 'why-vertical-vibro-casting-beats-spun-technology',
        content: '<p>Contech Concrete and Allied Industries uses the latest Vertical Vibro casting process instead of traditional spun technology.</p><p>Vibro casting delivers homogeneous compaction, uniform crushing strength at jacking surfaces, and a smooth crack-free surface. With a low water-cement ratio of 0.25&ndash;0.30, the result is heavier walled, longer lasting RCC pipes with excellent tolerance control.</p>',
        meta_title: 'Vertical Vibro Casting vs Spun Technology | Contech Concrete',
        meta_description: 'Why Contech uses vertical vibro casting for RCC concrete pipes: homogeneous compaction, no cosmetic cracking, and lower water-cement ratio for longer design life.',
        published_at: new Date().toISOString()
    },
    {
        title: 'Understanding IS 458:2003 RCC Pipe Specifications',
        slug: 'understanding-is-458-2003-rcc-pipe-specifications',
        content: '<p>RCC concrete pipes in India and Nepal are manufactured according to I.S. 458:2003 codes and specifications.</p><p>Our NP3 and NP4 pipes range from 600 mm to 2000 mm in internal diameter. Each size is load tested using the three edge bearing test and hydro tested to ensure leak-proof, sewage-safe performance.</p>',
        meta_title: 'IS 458:2003 RCC Pipe Specifications Explained | Contech Concrete',
        meta_description: 'Understand the IS 458:2003 standards for NP3 and NP4 RCC pipes, including load tests, diameters, and quality assurance at Contech Concrete.',
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
];

async function seed() {
    try {
        await db.initPromise;

        const prodRow = await db.get('SELECT COUNT(*) AS c FROM products');
        const productCount = prodRow ? Number(prodRow.c) : 0;
        if (productCount === 0) {
            for (const [dia, thick, len, crack, ultimate] of products) {
                await db.run(
                    'INSERT INTO products (id, internal_diameter, min_thickness, effective_length, load_crack, ultimate_load, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    uuidv4(), dia, thick, len, crack, ultimate, 'NP3/NP4'
                );
            }
            console.log(`Seeded ${products.length} product rows`);
        }

        const uRow = await db.get('SELECT COUNT(*) AS c FROM users');
        const userCount = uRow ? Number(uRow.c) : 0;
        if (userCount === 0) {
            const email = 'admin@contech.com.np';
            const password = 'Contech#2026';
            const hash = bcrypt.hashSync(password, 10);
            await db.run(
                'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
                uuidv4(), email, hash, 'admin'
            );
            console.log('Seeded admin user:');
            console.log(`  Email:    ${email}`);
            console.log(`  Password: ${password}`);
            console.log('  (Change this after first login.)');
        }

        const bRow = await db.get('SELECT COUNT(*) AS c FROM blogs');
        const blogCount = bRow ? Number(bRow.c) : 0;
        if (blogCount === 0) {
            for (const b of blogs) {
                await db.run(
                    'INSERT INTO blogs (id, title, slug, content, meta_title, meta_description, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    uuidv4(), b.title, b.slug, b.content, b.meta_title, b.meta_description, b.published_at
                );
            }
            console.log(`Seeded ${blogs.length} blog posts`);
        }
    } catch (err) {
        console.error('[seed] Warning: seed could not complete:', err.message);
    }
}

module.exports = seed;

if (require.main === module) {
    seed()
        .then(() => {
            console.log('Seed complete.');
            return db.close();
        })
        .catch(err => {
            console.error('Seed failed:', err.message);
            process.exit(1);
        });
}