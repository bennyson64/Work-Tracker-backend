import { app } from "../src/app.js";

/**
 * Tell Vercel this is an Edge Function
 */
export const config = {
  runtime: "edge",
};

/**
 * Vercel will call this automatically
 */
export default app.fetch;
