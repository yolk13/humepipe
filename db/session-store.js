const { Store } = require('express-session');

class SessionStore extends Store {
    constructor(db) {
        super();
        this.db = db;
        this.ready = db.initPromise.then(() => db.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                sid TEXT PRIMARY KEY,
                sess TEXT NOT NULL,
                expire BIGINT NOT NULL
            )
        `)).catch(err => {
            console.error('[sessions] table init failed:', err.message);
        });
    }

    get(sid, cb) {
        this.ready.then(async () => {
            try {
                const row = await this.db.get('SELECT sess FROM sessions WHERE sid = ? AND expire > ?', sid, Date.now());
                cb(null, row ? JSON.parse(row.sess) : null);
            } catch (err) {
                cb(err);
            }
        }).catch((err) => cb(err));
    }

    set(sid, session, cb) {
        this.ready.then(async () => {
            try {
                const sess = JSON.stringify(session);
                const expire = session.cookie && session.cookie.expires
                    ? new Date(session.cookie.expires).getTime()
                    : Date.now() + 7 * 24 * 60 * 60 * 1000;
                await this.db.run(
                    `INSERT INTO sessions (sid, sess, expire) VALUES (?, ?, ?)
                    ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expire = excluded.expire`,
                    sid, sess, expire
                );
                if (cb) cb();
            } catch (err) {
                if (cb) cb(err);
            }
        }).catch((err) => cb && cb(err));
    }

    destroy(sid, cb) {
        this.ready.then(async () => {
            try {
                await this.db.run('DELETE FROM sessions WHERE sid = ?', sid);
                if (cb) cb();
            } catch (err) {
                if (cb) cb(err);
            }
        }).catch((err) => cb && cb(err));
    }
}

module.exports = SessionStore;