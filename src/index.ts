// src/index.ts
import { serve } from "@hono/node-server";
import { app } from "./app.js";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`✅ Local Hono server running on http://localhost:${info.port}`);
  }
);
