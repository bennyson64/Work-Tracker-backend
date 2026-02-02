import { Hono } from "hono";
import { cors } from "hono/cors";
export const config = {
  runtime: "nodejs",
};

/**
 * Fake in-memory DB
 * (replaces frontend api/todo.ts)
 */
let TODOS = [];
/**
 * App
 */
const app = new Hono();
/**
 * Enable CORS for frontend
 */
app.use("*", cors({
    origin: "http://localhost:5173", // Vite default
    allowMethods: ["GET", "POST", "PATCH"],
    allowHeaders: ["Content-Type"],
}));
/**
 * Health check
 */
app.get("/", (c) => c.text("Hono Todo API running 🚀"));
/**
 * GET /todos
 */
app.get("/todos", (c) => {
    return c.json(TODOS);
});
/**
 * POST /todos
 */
app.post("/todos", async (c) => {
    const body = await c.req.json();
    const newTodo = {
        id: crypto.randomUUID(),
        title: body.title,
        status: body.status ?? "todo", // default
    };
    TODOS.push(newTodo);
    return c.json(newTodo, 201);
});
/**
 * PATCH /todos/:id
 */
app.patch("/todos/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const todo = TODOS.find((t) => t.id === id);
    if (!todo) {
        return c.json({ message: "Todo not found" }, 404);
    }
    todo.status = body.status;
    return c.json(todo);
});
export default app;
