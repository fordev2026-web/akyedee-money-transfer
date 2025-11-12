import { createTRPCRouter } from "./create-context.js"; // <-- add .js
import hiRoute from "./routes/example/hi/route.js"; // <-- add .js

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
});

export type AppRouter = typeof appRouter;
