import { Hono } from "hono";
import { cors } from "hono/cors";

type TodoStatus = "todo" | "in-progress" | "done";

type Todo = {
  id: string;
  title: string;
  status: TodoStatus;
};

let TODOS: Todo[] = [];

export const app = new Hono();

/* CORS */
app.use(
  "*",
  cors({
    origin: "*",
  })
);

app.get("/", (c) => c.text("Hono Todo API running"));

/* GET todos */
app.get("/todos", (c) => c.json(TODOS));

/* POST todo */
app.post("/todos", async (c) => {
  const body = (await c.req.json()) as { title: string };

  const newTodo: Todo = {
    id: Math.random().toString(36).slice(2),
    title: body.title,
    status: "todo",
  };

  TODOS.push(newTodo);
  return c.json(newTodo, 201);
});

/* PATCH status */
app.patch("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const body = (await c.req.json()) as { status: TodoStatus };

  const todo = TODOS.find((t) => t.id === id);
  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }

  todo.status = body.status;
  return c.json(todo);
});
