// src/App.js

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // import bootstrap
import { Button, ListGroup, Form } from "react-bootstrap";
import moment from "moment";

function App() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("");
  const [editing, setEditing] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editTime, setEditTime] = useState("");

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        setTasks(data); // Assuming the API returns an array of tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []); // Empty dependency array means this effect runs once on component mount

  // Handle task submission
  const handleAddTask = () => {
    const newTaskObj = {
      name: newTask,
      time: newTime,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
    setNewTime("");
  };

  // Handle edit task
  const handleEditTask = (task) => {
    setEditing(task);
    setEditTask(task.name);
    setEditTime(task.time);
  };

  // Handle task update
  const handleUpdateTask = () => {
    const updatedTasks = tasks.map((task) =>
      task === editing ? { ...task, name: editTask, time: editTime } : task
    );
    setTasks(updatedTasks);
    setEditing(null);
  };

  // Handle task deletion
  const handleDeleteTask = (task) => {
    setTasks(tasks.filter((t) => t !== task));
  };

  // Handle task completion
  const handleCompleteTask = (task) => {
    const updatedTasks = tasks.map((t) =>
      t === task ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="container mt-5">
      <h1>To-Do List</h1>

      {/* New Task Form */}
      <div className="mb-4">
        <Form>
          <Form.Group>
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Form>
      </div>

      {/* Task List */}
      <ListGroup>
        {tasks.map((task, index) => (
          <ListGroup.Item
            key={index}
            className={task.completed ? "bg-success text-white" : ""}
          >
            <div className="d-flex justify-content-between">
              <div>
                <h5
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEditTask(task)}
                >
                  {task.name}
                </h5>
                <p>{moment(task.time).format("YYYY-MM-DD HH:mm:ss")}</p>
                {task.completed && (
                  <span className="text-success">Completed</span>
                )}
              </div>

              <div>
                <Button
                  variant="success"
                  onClick={() => handleCompleteTask(task)}
                >
                  ✅
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteTask(task)}
                  className="ml-2"
                >
                  ❌
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Task Modal or Inline Editing */}
      {editing && (
        <div className="mt-4">
          <h3>Edit Task</h3>
          <Form>
            <Form.Group>
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateTask}>
              Update Task
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditing(null)}
              className="ml-2"
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default App;
