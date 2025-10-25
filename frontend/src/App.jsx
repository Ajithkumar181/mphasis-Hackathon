import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import DeviceManagerPage from "./pages/DeviceManagerPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import IntegrityPage from "./pages/IntegrityPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { Moon, Sun } from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches // Auto-detect user preference
  );

  // ✅ Update <html> class for dark mode globally
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  return (
    <Router>
      <div
        className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}
      >
        {/* 🌐 Navigation Bar */}
        <nav className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-500 transition ${
                  isActive ? "text-blue-600 dark:text-blue-400" : ""
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/devices"
              className={({ isActive }) =>
                `font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-500 transition ${
                  isActive ? "text-blue-600 dark:text-blue-400" : ""
                }`
              }
            >
              Devices
            </NavLink>

            <NavLink
              to="/integrity"
              className={({ isActive }) =>
                `font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-500 transition ${
                  isActive ? "text-blue-600 dark:text-blue-400" : ""
                }`
              }
            >
              Integrity
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-500 transition ${
                  isActive ? "text-blue-600 dark:text-blue-400" : ""
                }`
              }
            >
              Settings
            </NavLink>
          </div>

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:scale-105 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </nav>

        {/* 📄 Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full max-w-full mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceManagerPage />} />
              <Route path="/integrity" element={<IntegrityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
