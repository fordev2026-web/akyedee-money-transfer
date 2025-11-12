import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { serve } from "@hono/node-server";

// Simple context
const createContext = async () => ({});
type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

const createTRPCRouter = t.router;
const publicProcedure = t.procedure;

// Simple hello route
const hiRoute = publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
        return {
            hello: input.name,
            date: new Date(),
        };
    });

// App router
const appRouter = createTRPCRouter({
    example: createTRPCRouter({
        hi: hiRoute,
    }),
});

export type AppRouter = typeof appRouter;

// Create Hono app
const app = new Hono();

app.use("*", cors());

app.use(
    "/api/trpc/*",
    trpcServer({
        router: appRouter,
        createContext,
    })
);

app.get("/", (c) => {
    console.log("📥 Root endpoint hit");
    return c.json({
        status: "ok",
        message: "Akyedee Money Transfer API is running",
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get("/health", (c) => {
    console.log("🏥 Health endpoint hit");
    return c.json({
        status: "healthy",
        service: "akyedee-api",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 3000
    });
});

// Add a catch-all for debugging
app.all("*", (c) => {
    console.log(`❓ Unmatched request: ${c.req.method} ${c.req.path}`);
    return c.json({
        error: "Route not found",
        method: c.req.method,
        path: c.req.path,
        timestamp: new Date().toISOString()
    }, 404);
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Starting Akyedee Money Transfer API`);
console.log(`📍 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🚂 Railway Environment: ${process.env.RAILWAY_ENVIRONMENT || 'false'}`);
console.log(`🗂️  Working Directory: ${process.cwd()}`);

// Start the server
serve({
    fetch: app.fetch,
    port: port,
    hostname: '0.0.0.0', // Bind to all interfaces for Railway
}, (info) => {
    console.log(`✅ Server running on ${info.address}:${info.port}`);
});