// Import the express module
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// Create an instance of express
const app = express();
const mysql = require("mysql2");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Define a port number
const port = 3009;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Naruto@Itachi123", // Replace with your MySQL root password
  database: "vamshi",
});

// Create a simple route for the root path
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/api/registration", (req, res) => {
  pool.query("SELECT * FROM registration", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

app.post("/api/registration", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hello", req.body);
  pool.query(
    "INSERT INTO registration (username, email, password) VALUES (?,?,?)",
    [username, email, hashedPassword],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results);
    }
  );
});

// User login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  pool.query(
    "SELECT * FROM registration WHERE email = ?",
    [email],
    async (error, results) => {
      console.log(results);
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    }
  );
});

// Fetch tasks for a specific email
app.get("/api/todo", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send({ error: "Email is required" });
  }

  pool.query(
    "SELECT * FROM todo WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ tasks: results.map((task) => task.task) });
    }
  );
});

// Add a new task
app.post("/api/todo", async (req, res) => {
  const { email, task } = req.body;
  console.log("hello", req.body);
  pool.query(
    "INSERT INTO todo (email, task) VALUES (?,?)",
    [email, task],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results);
    }
  );
});

// Delete a task
app.delete("/api/todo", async (req, res) => {
  const { email, task } = req.body;

  if (!email || !task) {
    return res.status(400).send({ error: "Email and task are required" });
  }

  pool.query(
    "DELETE FROM todo WHERE email = ? AND task = ?",
    [email, task],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    }
  );
});

// Update a task
app.put("/api/todo", async (req, res) => {
  const { email, oldTask, newTask } = req.body;

  if (!email || !oldTask || !newTask) {
    return res
      .status(400)
      .send({ error: "Email, old task, and new task are required" });
  }

  pool.query(
    "UPDATE todo SET task = ? WHERE email = ? AND task = ?",
    [newTask, email, oldTask],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task updated successfully" });
    }
  );
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
