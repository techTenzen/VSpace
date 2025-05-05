// session.ts
import express from 'express';
import session from 'express-session';
import { storage } from './storage';

export function configureSession(app: express.Application) {
    // Check if session store was successfully initialized
    if (!storage.sessionStore) {
        console.warn('Session store initialization failed. Fallback to memory store.');

        // Use a memory store as fallback (not recommended for production)
        const MemoryStore = session.MemoryStore;

        app.use(session({
            store: new MemoryStore(),
            secret: env.SESSION_SECRET || 'my-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 // 24 hours
            }
        }));

        return;
    }

    // Use the PostgreSQL session store
    app.use(session({
        store: storage.sessionStore,
        secret: env.SESSION_SECRET || 'my-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        },
        // Improved session handling options
        rolling: true // Extends session lifetime on activity
    }));
}