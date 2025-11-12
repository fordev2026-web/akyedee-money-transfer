import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

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
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (c) => {
    return c.json({
        status: "healthy",
        service: "akyedee-api",
        version: "1.0.0"
    });
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Akyedee Money Transfer API starting on port ${port}`);

// Export app for development - do not auto-start server
console.log('Exporting app for development use...');

export default app;