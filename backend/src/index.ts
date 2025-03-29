import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db.js";

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/auth/login", async (c) => {
  const body = await c.req.json();
  const { name, rollNo } = body;

  if (!name || !rollNo || parseInt(rollNo) < 0) {
    return c.json({ error: "Name and roll number are required." }, 400);
  }

  try {
    let currentUser = await db.user.findUnique({
      where: {
        rollNo: parseInt(rollNo),
      },
    });

    if (!currentUser) {
      currentUser = await db.user.create({
        data: {
          name,
          rollNo: parseInt(rollNo),
        },
      });
    }
    return c.json({ message: "User created successfully.", currentUser }, 200);
  } catch (error) {
    return c.json({ error: "User already exists." }, 400);
  }
});

app.post("/time", async (c) => {
  const body = await c.req.json();
  const { rollNo, time } = body;

  if (!time || !rollNo || parseInt(rollNo) < 0 || parseInt(time) < 0) {
    return c.json({ error: "Missing fields." }, 400);
  }

  await db.record.upsert({
    where: {
      rollNo: parseInt(rollNo),
    },
    create: {
      rollNo: parseInt(rollNo),
      time: parseInt(time),
    },
    update: {
      time: parseInt(time),
    },
  });

  return c.json({ message: "Record Time updated successfully." }, 200);
});

app.get("/leaderboard", async (c) => {
  const records = await db.record.findMany({
    orderBy: {
      time: "asc",
    },
    include: {
      user: true,
    },
  });

  const parsedRecords = records.map((record) => {
    return {
      name: record.user.name,
      rollNo: record.user.rollNo,
      bestScore: record.time.toString() + "ms",
    };
  });

  return c.json({ records: parsedRecords }, 200);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
