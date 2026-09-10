const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'contech.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
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
    effective_length REAL,
    load_crack REAL,
    ultimate_load REAL,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    meta_title TEXT,
    meta_description TEXT,
    featured_image TEXT,
    published_at DATETIME
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Idempotent migrations for existing databases
function hasColumn(table, column) {
    return db.prepare(`PRAGMA table_info(${table})`)
        .all()
        .some(col => col.name === column);
}

if (!hasColumn('products', 'image')) {
    db.exec('ALTER TABLE products ADD COLUMN image TEXT');
    console.log('Migrated: products.image column added');
}

if (!hasColumn('enquiries', 'pipe_diameter')) {
    db.exec('ALTER TABLE enquiries ADD COLUMN pipe_diameter TEXT');
    console.log('Migrated: enquiries.pipe_diameter column added');
}

if (!hasColumn('enquiries', 'delivery_site')) {
    db.exec('ALTER TABLE enquiries ADD COLUMN delivery_site TEXT');
    console.log('Migrated: enquiries.delivery_site column added');
}

module.exports = db;
