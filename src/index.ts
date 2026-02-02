import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

/**
 * Types
 */
type TodoStatus = "todo" | "in-progress" | "done";

type Todo = {
  id: string;
  title: string;
  status: TodoStatus;
};

/**
 * Fake in-memory DB
 */
let TODOS: Todo[] = [];

/**
 * App
 */
const app = new Hono();

/**
 * CORS (for Vite frontend)
 */
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PATCH"],
    allowHeaders: ["Content-Type"],
  })
);

/**
 * Routes
 */
app.get("/", (c) => c.text("Go to /todos fo viewing tasks"));

app.get("/todos", (c) => {
  return c.json(TODOS);
});

app.post("/todos", async (c) => {
  const body = await c.req.json<{ title: string; status?: TodoStatus }>();

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title: body.title,
    status: body.status ?? "todo",
  };

  TODOS.push(newTodo);
  return c.json(newTodo, 201);
});

app.patch("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ status: TodoStatus }>();

  const todo = TODOS.find((t) => t.id === id);
  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }

  todo.status = body.status;
  return c.json(todo);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`✅ Hono server running on http://localhost:${info.port}`);
  }
);