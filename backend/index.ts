import app from './hono';

const port = process.env.PORT || 3000;

console.log(`🚀 Starting Akyedee Money Transfer API on port ${port}`);

export default {
    port,
    fetch: app.fetch,
};