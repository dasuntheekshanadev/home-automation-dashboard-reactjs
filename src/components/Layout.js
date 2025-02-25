// src/components/Layout.js
import React from "react";
import AuthDetails from "./AuthDetails";
import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="w-full bg-gray-800 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">Smart IoT Dashboard</h1>
        <ul className="flex gap-6 items-center">
          <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
          <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
          <li>
            <AuthDetails />
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 p-4 text-center text-gray-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} Smart IoT Dashboard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;