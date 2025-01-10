import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    window.location.href = "/";
  };
  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 bg-gray-700 text-white p-2 rounded z-50"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        Menu
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 text-white z-[1000] p-4 flex flex-col">
          <button
            className="text-right text-red-500 mb-4"
            onClick={() => setSidebarOpen(false)}
          >
            Close
          </button>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
              <ul>
                <li className="mb-4">
                  <Link
                    to="/overview"
                    className="hover:text-gray-400"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Overview
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/villages"
                    className="hover:text-gray-400"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Village Management
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/chat"
                    className="hover:text-gray-400"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Chat
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="hover:text-gray-400"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-between mt-4">
              <img
                src="https://via.placeholder.com/40"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm">Admin Name</span>
              <button className="text-red-500 hover:underline">Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:flex fixed top-0 left-0 w-64 bg-gray-800 text-white h-full p-4 flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul>
            <li className="mb-4">
              <Link to="/overview" className="hover:text-gray-400">
                Overview
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/villages" className="hover:text-gray-400">
                Village Management
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/chat" className="hover:text-gray-400">
                Chat
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-gray-400">
                Gallery
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-between mt-4">
          <img
            src="https://via.placeholder.com/40"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-sm">{localStorage.username || ""}</span>
          <button
            className="text-red-500 hover:underline"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
