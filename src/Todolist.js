import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Todolist.css";
import axios from "axios";

const Todolist = () => {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null); // New state for editing
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = localStorage.getItem("email");

    if (!email) {
      alert("No email found in local storage");
      return;
    }

    try {
      if (editingTask) {
        // Update task
        await axios.put("http://localhost:3009/api/todo", {
          email: email,
          oldTask: editingTask,
          newTask: inputValue,
        });
        setEditingTask(null);
      } else {
        // Add new task
        await axios.post("http://localhost:3009/api/todo", {
          email: email,
          task: inputValue,
        });
      }

      console.log("Data sent successfully!");
      setInputValue(""); // Clear the input after successful submission
      fetchTasks(); // Fetch updated list of tasks
    } catch (error) {
      console.error("There was an error sending the data!", error);
    }
  };

  const fetchTasks = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("No email found in local storage");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3009/api/todo?email=${email}`
      );
      setTasks(response.data.tasks || []); // Ensure tasks is an array
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setInputValue(task); // Set input value to the task being edited
  };

  const handleDelete = async (taskToDelete) => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("No email found in local storage");
      return;
    }

    try {
      await axios.delete(`http://localhost:3009/api/todo`, {
        data: {
          email: email,
          task: taskToDelete,
        },
      });
      console.log("Task deleted successfully!");
      setTasks(tasks.filter((task) => task !== taskToDelete)); // Update state to remove task
    } catch (error) {
      console.error("There was an error deleting the task!", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("email"); // Remove the email from local storage
    navigate("/login"); // Navigate to the login page
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="todo1">
      <form onSubmit={handleSubmit} className="form11">
        <input
          className="inp11"
          type="text"
          name="task"
          value={inputValue}
          onChange={handleChange}
        />
        <button type="submit" className="btn11">
          {editingTask ? "Update" : "Submit"}
        </button>
      </form>
      <button className="btn12" onClick={handleLogout}>
        Logout
      </button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task}
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todolist;
