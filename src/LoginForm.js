import React, { useState } from "react";
import "./LoginForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form data here
    // Submit the form data (e.g., send it to an API)
    try {
      const response = await axios.post("http://localhost:3009/api/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);
      setMessage(response.data.message);
      if (response.data.message === "Login successful") {
        console.log("login successful");
        localStorage.setItem("email", formData.email);
        navigate("/todo");
      }
    } catch (error) {
      setMessage("Error: " + error.response.data.message);
      alert("details are not found or error");
    }
  };

  return (
    <div className="auth-form1">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn19" type="submit">
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/registration")}
            className="switch-link"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
