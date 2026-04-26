require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const initDatabase = require("./db/init");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  }
};

async function startApp() {
  await initDatabase(dbConfig);

  const pool = mysql.createPool(dbConfig);

  // GET all tasks
  app.get("/api/tasks", async (req, res) => {
    const [rows] = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );

    res.json(rows);
  });

  // POST create task
  app.post("/api/tasks", async (req, res) => {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    await pool.query(
      "INSERT INTO tasks (title) VALUES (?)",
      [title]
    );

    res.status(201).json({ message: "Task created" });
  });

  // PUT toggle completed orr pending
  app.put("/api/tasks/:id/toggle", async (req, res) => {
    await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Task updated" });
  });

  // DELETE task
  app.delete("/api/tasks/:id", async (req, res) => {
    await pool.query(
      "DELETE FROM tasks WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Task deleted" });
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
  });
}

startApp();