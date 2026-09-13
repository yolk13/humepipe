const { Pool } = require('pg');

const connStr = process.env.DATABASE_URL || '';

let pool;
if (!connStr && process.env.NODE_ENV === 'test') {
    const { newDb } = require('pg-mem');
    const mem = newDb({ noAstCoverageCheck: true });
    const MemPool = mem.adapters.createPg().Pool;
    pool = new MemPool();
} else {
    const useSsl = /(^|[?&])sslmode=require($|&)/i.test(connStr)
        || process.env.DB_SSL === 'true'
        || process.env.NODE_ENV === 'production';
    pool = new Pool({
        connectionString: connStr,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined
    });
    if (!connStr) {
        console.warn('WARNING: DATABASE_URL not set. Queries will fail until it is configured.');
    }
}

function translate(sql) {
    let n = 0;
    return sql.replace(/\?/g, () => `$${++n}`);
}

async function get(sql, ...params) {
    const result = await pool.query(translate(sql), params);
    return result.rows[0] || null;
}

async function all(sql, ...params) {
    const result = await pool.query(translate(sql), params);
    return result.rows;
}

async function run(sql, ...params) {
    const result = await pool.query(translate(sql), params);
    return { changes: result.rowCount, lastInsertRowid: null };
}

async function init() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'admin'
        );

        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            internal_diameter INTEGER,
            min_thickness INTEGER,
            effective_length DOUBLE PRECISION,
            load_crack DOUBLE PRECISION,
            ultimate_load DOUBLE PRECISION,
            type TEXT,
            image TEXT
        );

        CREATE TABLE IF NOT EXISTS blogs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            content TEXT,
            meta_title TEXT,
            meta_description TEXT,
            featured_image TEXT,
            published_at TIMESTAMPTZ
        );

        CREATE TABLE IF NOT EXISTS enquiries (
            id TEXT PRIMARY KEY,
            client_name TEXT,
            company_name TEXT,
            email TEXT,
            phone TEXT,
            pipe_type TEXT,
            pipe_diameter TEXT,
            quantity INTEGER,
            delivery_site TEXT,
            message TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT now()
        );
    `);
}

const initPromise = init().catch(err => {
    console.error('[db] schema init failed:', err.message);
});

async function close() {
    try {
        await pool.end();
    } catch {}
}

module.exports = { pool, get, all, run, init, initPromise, close };