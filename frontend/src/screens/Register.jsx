import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context.jsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/user/register", { email, password })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-4">Create Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>
        <p className="text-white mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
