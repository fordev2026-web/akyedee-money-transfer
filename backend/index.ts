import app from './hono.js';
import { createContext } from './trpc/create-context.js'; // <-- add .js
import { appRouter } from './trpc/app-router.js'; // <-- add .js

const port = process.env.PORT || 3000;

console.log(`🚀 Starting Akyedee Money Transfer API on port ${port}`);

export default {
    port,
    fetch: app.fetch,
};