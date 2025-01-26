// backend/server.js
const express = require("express"); // דרוש לצורך יצירת האפליקציה
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // כאן אנחנו מגדירים את האפליקציה של Express
const PORT = 5000;

app.use(cors());
app.use(express.json()); // מאפשר לקרוא נתונים ב-JSON

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/todolist", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define the routes for tasks
const Task = require("./models/Task"); // ודא שהמודל קיים בתיקייה models

// Add task API route
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, deadline } = req.body;
    const task = new Task({ title, deadline });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
});

// Get tasks API route
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
