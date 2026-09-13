const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { put, del } = require('@vercel/blob');

const MIME_EXT = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
};

const uploadDir = () => path.join(__dirname, '..', 'public', 'uploads');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (MIME_EXT[file.mimetype]) return cb(null, true);
        cb(new Error('Only JPG, PNG, WebP, or GIF images are allowed.'));
    }
});

async function storeUpload(buffer, mimetype) {
    const name = uuidv4() + MIME_EXT[mimetype];
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const res = await put(`uploads/${name}`, buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: false
        });
        return res.url;
    }
    const dir = uploadDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), buffer);
    return `/uploads/${name}`;
}

// Only ever touch Vercel Blob URLs or files under /uploads to avoid surprises.
function removeUpload(file) {
    if (!file) return;
    const value = String(file);
    if (/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(value)) {
        del(value, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(err => {
            console.error('[blob] delete failed:', err.message);
        });
        return;
    }
    if (value.startsWith('/uploads/')) {
        fs.unlink(path.join(uploadDir(), path.basename(value)), () => {});
    }
}

function uploadErrorHandler(err, req, res, next) {
    if (err && (err instanceof multer.MulterError || /only|LIMIT|unexpected file|field/i.test(String(err.message)))) {
        if (req.session) req.session.flash = { type: 'error', text: err.message || 'Upload failed.' };
        return res.redirect(req.headers.referer || '/admin');
    }
    next(err);
}

module.exports = { upload, uploadDir, storeUpload, removeUpload, uploadErrorHandler };