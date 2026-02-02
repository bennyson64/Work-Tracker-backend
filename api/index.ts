export const config = {
  runtime: "nodejs",
};

// import { app } from "../src/app.js";

// export default app;

export default function handler() {
  return new Response("Node runtime runs");
}