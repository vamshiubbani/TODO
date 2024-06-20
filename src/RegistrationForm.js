import React, { useState } from "react";
import "./RegistrationForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationForm = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    try {
      const response = await axios.post(
        "http://localhost:3009/api/registration",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      console.log(response.data);
      console.log("Data sent successfully!");
    } catch (error) {
      console.error("There was an error sending the data!", error);
    }

    // Validate the form data here (e.g., password match, email format)
    //     if (formData.password !== formData.confirmPassword) {
    //       alert('Passwords do not match');
    //       return;
    //     }
    //     // Submit the form data (e.g., send it to an API)
    //     console.log('Registration form submitted:', formData);
    //     alert('Registration successful!');
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group1">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group2">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group4">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="switch-link">
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
