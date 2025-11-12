import { publicProcedure } from "../../create-context.js"; // <-- add .js
import { z } from "zod";

const hiRoute = publicProcedure
  .input(z.object({ name: z.string() })) // add typing for input
  .mutation(({ input }: { input: { name: string } }) => { // fix TS7031
    return {
      greeting: `Hello ${input.name}`,
    };
  });

export default hiRoute;
