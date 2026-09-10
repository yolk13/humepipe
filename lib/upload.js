const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const MIME_EXT = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, uuidv4() + MIME_EXT[file.mimetype])
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (MIME_EXT[file.mimetype]) return cb(null, true);
        cb(new Error('Only JPG, PNG, WebP, or GIF images are allowed.'));
    }
});

// Only ever delete files under /uploads to avoid path traversal surprises.
function removeUpload(filePath) {
    if (!filePath || !String(filePath).startsWith('/uploads/')) return;
    const abs = path.join(uploadDir, path.basename(filePath));
    fs.unlink(abs, () => {});
}

function uploadErrorHandler(err, req, res, next) {
    if (err && (err instanceof multer.MulterError || /only|LIMIT|unexpected file|field/i.test(String(err.message)))) {
        if (req.session) req.session.flash = { type: 'error', text: err.message || 'Upload failed.' };
        return res.redirect(req.headers.referer || '/admin');
    }
    next(err);
}

module.exports = { upload, uploadDir, removeUpload, uploadErrorHandler };