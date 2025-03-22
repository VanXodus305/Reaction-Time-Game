import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/auth/login", async (c) => {
  const body = await c.req.json();
  const { name, rollNo } = body;

  if (!name || !rollNo) {
    return c.json({ error: "Name and roll number are required." }, 400);
  }
});

app.post("/time", async (c) => {
  const body = await c.req.json();
  const { time } = body;

  if (!time) {
    return c.json({ error: "Time is required." }, 400);
  }

  return c.json({ message: `Time received: ${time}` });
});

app.get("/leaderboard", async (c) => {});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
