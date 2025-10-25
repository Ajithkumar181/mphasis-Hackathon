// SettingsPage.jsx
import React, { useState } from "react";
import { Sun, Moon, CheckCircle, XCircle, User, Shield, Folder, Bell, Download } from "lucide-react";

// ✅ Mock initial settings
const defaultSettings = {
  username: "AjithKumar",
  email: "ajith@example.com",
  theme: "dark",
  notifications: true,
  defaultFolder: "C:/Downloads",
  maxFileSize: 50, // MB
  autoRetry: true,
  password: "",
  twoFA: false,
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle theme
  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  // Save settings (simulate API call)
  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage("Settings saved successfully");
    setIsLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  // Reset settings to defaults
  const handleReset = () => {
    setSettings(defaultSettings);
    setMessage("Settings reset to default");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your account preferences and application settings
          </p>
        </div>

        {/* Message Toast */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={settings.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                           bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                           bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Change Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={settings.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                           bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-red-500 focus:border-transparent
                           transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 
                              hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="twoFA"
                  checked={settings.twoFA}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 
                           dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Two-Factor Authentication (2FA)
                </span>
              </label>
            </div>
          </section>

          {/* Transfer Preferences Section */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold">Transfer Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Download Folder
                </label>
                <input
                  type="text"
                  name="defaultFolder"
                  value={settings.defaultFolder}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                           bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-green-500 focus:border-transparent
                           transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  name="maxFileSize"
                  value={settings.maxFileSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                           bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-green-500 focus:border-transparent
                           transition-all duration-200"
                />
              </div>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 
                              hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="autoRetry"
                  checked={settings.autoRetry}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 
                           dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Auto-Retry for Failed Transfers
                </span>
              </label>
            </div>
          </section>

          {/* Theme & Notifications Section */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold">Appearance & Notifications</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-700/50 
                         hover:bg-gray-200 dark:hover:bg-gray-600/50 px-6 py-3 rounded-xl transition-all 
                         duration-200 font-medium border border-gray-200/50 dark:border-gray-600/50
                         hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
              >
                {settings.theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-500" />
                )}
                Switch to {settings.theme === "dark" ? "Light" : "Dark"} Mode
              </button>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 
                              hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 
                           dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Push Notifications
                </span>
              </label>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 
                       hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold 
                       shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle size={20} />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 
                       hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-semibold 
                       shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] 
                       border border-gray-300/20"
            >
              <XCircle size={20} />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;