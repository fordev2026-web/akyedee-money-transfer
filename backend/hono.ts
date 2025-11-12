import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from './trpc/app-router.js';
import { createContext } from './trpc/create-context.js';
import { serve } from "@hono/node-server"; // needed to start server

const app = new Hono();

app.use("*", cors());

app.use(
  "/api/trpc", // <-- no wildcard
  trpcServer({
    endpoint: "/api/trpc", // must match this exactly
    router: appRouter,
    createContext,
  })
);

// ✅ Health check route
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// catch-all
app.all("*", (c) => {
  return c.json(
    { error: "Route not found", path: c.req.path },
    404
  );
});

const port = Number(process.env.PORT) || 3000;

// Bind differently for local vs Railway
const hostname = process.env.RAILWAY_ENVIRONMENT ? '0.0.0.0' : '127.0.0.1';

console.log(`🚀 Starting Akyedee Money Transfer API on port ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🖥 Hostname: ${hostname}`);

// Start the server
serve(
  {
    fetch: app.fetch,
    port,
    hostname,
  },
  (info) => {
    console.log(`✅ Server running on ${info.address}:${info.port}`);
  }
);

export default app;
