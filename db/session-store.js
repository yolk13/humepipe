const { Store } = require('express-session');

class SqliteSessionStore extends Store {
    constructor(db) {
        super();
        this.db = db;
        db.exec(`
            CREATE TABLE IF NOT EXISTS sessions (
                sid TEXT PRIMARY KEY,
                sess TEXT NOT NULL,
                expire INTEGER NOT NULL
            )
        `);
    }

    get(sid, cb) {
        try {
            const row = this.db.prepare('SELECT sess FROM sessions WHERE sid = ? AND expire > ?')
                .get(sid, Date.now());
            cb(null, row ? JSON.parse(row.sess) : null);
        } catch (err) {
            cb(err);
        }
    }

    set(sid, session, cb) {
        try {
            const sess = JSON.stringify(session);
            const expire = session.cookie && session.cookie.expires
                ? new Date(session.cookie.expires).getTime()
                : Date.now() + 7 * 24 * 60 * 60 * 1000;
            this.db.prepare(`
                INSERT INTO sessions (sid, sess, expire) VALUES (?, ?, ?)
                ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expire = excluded.expire
            `).run(sid, sess, expire);
            if (cb) cb();
        } catch (err) {
            if (cb) cb(err);
        }
    }

    destroy(sid, cb) {
        try {
            this.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
            if (cb) cb();
        } catch (err) {
            if (cb) cb(err);
        }
    }
}

module.exports = SqliteSessionStore;
