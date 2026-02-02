import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";


type TodoStatus = "todo" | "in-progress" | "done";

type Todo = {
  id: string;
  title: string;
  status: TodoStatus;
};


let TODOS: Todo[] = [];


const app = new Hono();


app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.options("*", (c) => c.body(null, 204));


app.get("/", (c) => c.text("✅ Hono Todo API running on Vercel"));

app.get("/todos", (c) => c.json(TODOS));

app.get("/todos/:id", (c) => {
  const id = c.req.param("id");
  const todo = TODOS.find((t) => t.id === id);
  if (!todo) return c.json({ message: "Todo not found" }, 404);
  return c.json(todo);
});

app.post("/todos", async (c) => {
  const body = await c.req.json<{ title?: string }>();

  if (!body.title?.trim()) {
    return c.json({ message: "Title is required" }, 400);
  }

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title: body.title,
    status: "todo",
  };

  TODOS.push(newTodo);
  return c.json(newTodo, 201);
});

app.patch("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ status?: TodoStatus }>();

  const todo = TODOS.find((t) => t.id === id);
  if (!todo) return c.json({ message: "Todo not found" }, 404);
  if (!body.status) {
    return c.json({ message: "Status is required" }, 400);
  }

  todo.status = body.status;
  return c.json(todo);
});

app.put("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ title?: string; status?: TodoStatus }>();

  const todo = TODOS.find((t) => t.id === id);
  if (!todo) return c.json({ message: "Todo not found" }, 404);

  if (body.title !== undefined) todo.title = body.title;
  if (body.status !== undefined) todo.status = body.status;

  return c.json(todo);
});

app.delete("/todos/:id", (c) => {
  const id = c.req.param("id");
  const index = TODOS.findIndex((t) => t.id === id);

  if (index === -1) {
    return c.json({ message: "Todo not found" }, 404);
  }

  const deleted = TODOS.splice(index, 1)[0];
  return c.json(deleted);
});


export default handle(app);
