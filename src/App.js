import React from "react";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import Todo from "./Todolist";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registration" exact element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="*" element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
