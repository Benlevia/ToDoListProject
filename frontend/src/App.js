// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css"; // ייבוא של Bootstrap

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(null); // מצב עריכת שם משימה
  const [isEditingDeadline, setIsEditingDeadline] = useState(null); // מצב עריכת זמן משימה
  const [editedTaskName, setEditedTaskName] = useState("");
  const [editedTaskDeadline, setEditedTaskDeadline] = useState("");

  // Fetch tasks from the backend server (עדכון לכתובת ה-API ב-Vercel)
  useEffect(() => {
    axios
      .get("https://to-do-list-project-five-vert.vercel.app/api/tasks") // עדכון ל-API ב-Vercel
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const addTask = () => {
    const task = { title: newTask, deadline };
    axios
      .post("https://to-do-list-project-five-vert.vercel.app/api/tasks", task) // עדכון ל-API ב-Vercel
      .then((response) => setTasks([...tasks, response.data]))
      .catch((error) => console.error("Error adding task:", error));
  };

  // Mark task as completed
  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task._id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  // Mark task as cancelled
  const cancelTask = (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  // Update task title
  const updateTaskTitle = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, title: editedTaskName } : task
    );
    setTasks(updatedTasks);
    setIsEditingTitle(null); // סיום עריכת שם המשימה
  };

  // Update task deadline
  const updateTaskDeadline = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, deadline: editedTaskDeadline } : task
    );
    setTasks(updatedTasks);
    setIsEditingDeadline(null); // סיום עריכת זמן המשימה
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">To-Do List</h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Task name"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="datetime-local"
            className="form-control"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-primary w-100" onClick={addTask}>
        Add Task
      </button>

      <ul className="list-group mt-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              task.completed ? "bg-success text-white" : ""
            }`}
          >
            <div>
              {/* אם אנחנו במצב עריכה של שם המשימה */}
              {isEditingTitle === task._id ? (
                <div>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={task.title}
                    onChange={(e) => setEditedTaskName(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => updateTaskTitle(task._id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => {
                    setIsEditingTitle(task._id);
                    setEditedTaskName(task.title);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {task.title}
                </span>
              )}

              <br />

              {/* הזמן שנותר */}
              <small>Time Left: {moment(task.deadline).fromNow()}</small>
            </div>
            <div>
              {/* אם אנחנו במצב עריכה של זמן המשימה */}
              {isEditingDeadline === task._id ? (
                <div>
                  <input
                    type="datetime-local"
                    className="form-control"
                    defaultValue={moment(task.deadline).format(
                      "YYYY-MM-DDTHH:mm"
                    )}
                    onChange={(e) => setEditedTaskDeadline(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => updateTaskDeadline(task._id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => {
                    setIsEditingDeadline(task._id);
                    setEditedTaskDeadline(task.deadline);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {moment(task.deadline).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              )}
            </div>
            <div>
              <button
                className="btn btn-success btn-sm mx-2"
                onClick={() => completeTask(task._id)}
                disabled={task.completed}
              >
                <i className="fas fa-check"></i> {/* אייקון של וי */}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => cancelTask(task._id)}
              >
                <i className="fas fa-times"></i> {/* אייקון של איקס */}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
