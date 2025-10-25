import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react"; // ✅ Icons for dark mode toggle

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const intervals = useRef({});

  // Apply dark mode class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  // Handle file selection
  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "Pending",
    }));
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  // Start a new transfer
  const startTransfer = (file) => {
    setTransfers((prev) => [...prev, { ...file, status: "Uploading" }]);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));

    const intervalId = setInterval(() => {
      setTransfers((prevTransfers) =>
        prevTransfers
          .map((t) => {
            if (t.id === file.id && t.status === "Uploading") {
              const newProgress = t.progress + Math.random() * 8;
              if (newProgress >= 100) {
                clearInterval(intervals.current[file.id]);
                delete intervals.current[file.id];
                setHistory((prev) => [
                  ...prev,
                  { ...t, progress: 100, status: "Completed" },
                ]);
                return null;
              }
              return { ...t, progress: newProgress };
            }
            return t;
          })
          .filter(Boolean)
      );
    }, 500);

    intervals.current[file.id] = intervalId;
  };

  // Pause or Resume transfer
  const toggleTransfer = (id, action) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: action === "pause" ? "Paused" : "Uploading" } : t
      )
    );

    if (action === "pause") {
      clearInterval(intervals.current[id]);
      delete intervals.current[id];
    } else if (action === "resume") {
      const file = transfers.find((t) => t.id === id);
      if (file) startTransfer(file);
    }
  };

  // Simulate file verification
  const verifyFile = (fileId) => {
    setHistory((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const verified = Math.random() > 0.1;
          return { ...f, verified: verified ? "✅ Verified" : "❌ Corrupted" };
        }
        return f;
      })
    );
  };

  useEffect(() => {
    return () => Object.values(intervals.current).forEach(clearInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 font-sans transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Smart File Transfer Dashboard
        </h1>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:scale-105 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      {/* Upload Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Upload Files
        </h2>
        <input
          type="file"
          multiple
          onChange={handleFiles}
          className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200"
        />
        <div className="mt-4 space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
            >
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                onClick={() => startTransfer(file)}
                className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Active Transfers */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Active Transfers
        </h2>
        {transfers.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No active transfers.</p>
        )}
        <div className="space-y-4">
          {transfers.map((t) => (
            <div key={t.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-800 dark:text-gray-200">{t.name}</span>
                <span
                  className={`font-semibold ${
                    t.status === "Paused"
                      ? "text-yellow-500"
                      : t.status === "Uploading"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 transition-all duration-300 ${
                    t.status === "Paused" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${t.progress}%` }}
                ></div>
              </div>
              <div className="mt-3 flex gap-3">
                {t.status === "Uploading" && (
                  <button
                    onClick={() => toggleTransfer(t.id, "pause")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Pause
                  </button>
                )}
                {t.status === "Paused" && (
                  <button
                    onClick={() => toggleTransfer(t.id, "resume")}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transfer History */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Transfer History
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No completed transfers.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border px-3 py-2 text-left dark:border-gray-600">File Name</th>
                  <th className="border px-3 py-2 dark:border-gray-600">Size (MB)</th>
                  <th className="border px-3 py-2 dark:border-gray-600">Status</th>
                  <th className="border px-3 py-2 dark:border-gray-600">Verified</th>
                  <th className="border px-3 py-2 dark:border-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="border px-3 py-2 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {f.name}
                    </td>
                    <td className="border px-3 py-2 text-center dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {(f.size / 1024 / 1024).toFixed(2)}
                    </td>
                    <td className="border px-3 py-2 text-center dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {f.status}
                    </td>
                    <td className="border px-3 py-2 text-center dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {f.verified || "-"}
                    </td>
                    <td className="border px-3 py-2 text-center dark:border-gray-600">
                      <button
                        onClick={() => verifyFile(f.id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition"
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
