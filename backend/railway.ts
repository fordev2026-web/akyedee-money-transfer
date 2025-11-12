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
    return c.json({
        status: "ok",
        message: "Akyedee Money Transfer API is running",
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 3000
    });
});

app.get("/health", (c) => {
    return c.json({
        status: "healthy",
        service: "akyedee-api",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Starting Akyedee Money Transfer API on port ${port}`);

// Start the server
serve({
    fetch: app.fetch,
    port: port,
});

console.log(`✅ Server running on port ${port}`);