import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./db.js";

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

  try {
    const user = await db.user.create({
      data: {
        name,
        rollNo,
      },
    });
    return c.json({ message: "User created successfully.", user }, 200);
  } catch (error) {
    return c.json({ error: "User already exists." }, 400);
  }
});

app.post("/time", async (c) => {
  const body = await c.req.json();
  const { userId, time } = body;

  if (!time || !userId) {
    return c.json({ error: "Missing fields." }, 400);
  }

  await db.record.upsert({
    where: {
      userId: userId,
    },
    create: {
      userId,
      time,
    },
    update: {
      time,
    },
  });

  return c.json({ message: "Record Time updated successfully." }, 200);
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
