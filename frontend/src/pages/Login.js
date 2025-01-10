import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const LOGIN = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, error }] = useLazyQuery(LOGIN);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      login({ variables: { username, password } });
      if (data?.login?.token) {
        localStorage.setItem("token", data.login.token);
        localStorage.setItem("username", data.login.username);
        localStorage.setItem("id", data.login.id);
        alert("Login successful");
        window.location.href = "/overview";
      }
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't Have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Signup
          </Link>
        </p>
        <p className="text-center text-sm mt-4">
        Testing ?
        someof users:
        admin1,
        admin2,
        user1,
        password:
        password123
        </p>
        {error && <p className="text-red-500 mt-4">{error.message}</p>}
      </div>
    </div>
  );
};

export default Login;
