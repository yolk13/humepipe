let app;
let initError = null;

try {
    app = require('../server');
} catch (err) {
    console.error('CRITICAL: Failed to load server.js:', err);
    initError = err;
}

module.exports = (req, res) => {
    if (initError) {
        console.error('Request received but server failed to initialize:', initError);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Function Initialization Error</title></head>
            <body style="font-family:sans-serif;padding:2rem;">
                <h1 style="color:#e11d48;">Server Initialization Failed</h1>
                <p><strong>Error:</strong> ${initError.message}</p>
                <pre style="background:#f1f5f9;padding:1rem;border-radius:6px;overflow-x:auto;">${initError.stack}</pre>
            </body>
            </html>
        `);
    }

    try {
        return app(req, res);
    } catch (err) {
        console.error('CRITICAL: Unhandled runtime error in Express:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Function Invocation Error</title></head>
            <body style="font-family:sans-serif;padding:2rem;">
                <h1 style="color:#e11d48;">Unhandled Runtime Error</h1>
                <p><strong>Error:</strong> ${err.message}</p>
                <pre style="background:#f1f5f9;padding:1rem;border-radius:6px;overflow-x:auto;">${err.stack}</pre>
            </body>
            </html>
        `);
    }
};