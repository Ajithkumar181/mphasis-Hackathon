import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Moon, Sun } from "lucide-react";

const mockDevices = [
  { id: "D001", name: "Receiver 1", status: "Connected", signal: 92 },
  { id: "D002", name: "Receiver 2", status: "Disconnected", signal: 0 },
  { id: "D003", name: "Receiver 3", status: "Connected", signal: 76 },
];

// ✅ Device Card
const DeviceCard = ({ device, onPing, onReconnect, onDisconnect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Connected":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "Disconnected":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    }
  };

  const signalBars = [25, 50, 75, 100];
  const activeBars = signalBars.filter((s) => s <= device.signal).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{device.name}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">ID: {device.id}</p>
      <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(device.status)}`}>
        {device.status}
      </p>

      {device.status === "Connected" && (
        <div className="flex items-center gap-3 mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">Signal:</span>
          <div className="flex gap-1 items-end">
            {signalBars.map((bar, i) => (
              <div
                key={i}
                className={`rounded-sm transition-all duration-300 ${
                  i < activeBars ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
                style={{ height: `${4 + (i + 1) * 6}px`, width: "6px" }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">{device.signal}%</span>
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <button
          onClick={() => onPing(device)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md transition-all hover:shadow-lg active:scale-95"
        >
          Ping
        </button>
        <button
          onClick={() => onReconnect(device)}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md transition-all hover:shadow-lg active:scale-95"
        >
          Reconnect
        </button>
        <button
          onClick={() => onDisconnect(device)}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md transition-all hover:shadow-lg active:scale-95"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

// ✅ Main Device Manager Page
const DeviceManagerPage = () => {
  const [devices, setDevices] = useState(mockDevices);
  const [networkStatus, setNetworkStatus] = useState("Connected");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // 🌐 Auto network health
  useEffect(() => {
    const avgSignal = devices.reduce((sum, d) => sum + d.signal, 0) / devices.length;
    setNetworkStatus(avgSignal > 70 ? "Connected" : avgSignal > 40 ? "Unstable" : "Disconnected");
  }, [devices]);

  // 🔄 Simulate device status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((d) =>
          Math.random() < 0.3
            ? {
                ...d,
                status: d.status === "Connected" ? "Disconnected" : "Connected",
                signal: d.status === "Connected" ? 0 : Math.floor(Math.random() * 40) + 60,
              }
            : d
        )
      );
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePing = (device) => {
    const latency = Math.floor(Math.random() * 120) + 20;
    const color = latency < 50 ? "text-green-500" : latency < 100 ? "text-yellow-500" : "text-red-500";
    showMessage(
      <span className={`font-medium ${color}`}>Ping to {device.name}: {latency} ms</span>
    );
  };

  const handleReconnect = (device) => {
    setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, status: "Connected", signal: 85 } : d)));
    showMessage(`${device.name} reconnected successfully ✅`);
  };

  const handleDisconnect = (device) => {
    setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, status: "Disconnected", signal: 0 } : d)));
    showMessage(`${device.name} disconnected ❌`);
  };

  const filteredDevices = devices.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen transition-all p-6`}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Device Manager Dashboard</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 transition bg-white dark:bg-gray-800"
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:scale-105 transition"
          >
            {darkMode ? <Sun className="text-yellow-400 w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <span
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-white font-semibold shadow-md ${
              networkStatus === "Connected"
                ? "bg-green-500"
                : networkStatus === "Unstable"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {networkStatus === "Connected" ? <Wifi /> : <WifiOff />}
            {networkStatus}
          </span>
        </div>
      </div>

      {/* Toast message */}
      {message && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-3 rounded-xl shadow-lg animate-slide-in">
          {message}
        </div>
      )}

      {/* Device Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.length ? (
          filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onPing={handlePing}
              onReconnect={handleReconnect}
              onDisconnect={handleDisconnect}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500 dark:text-gray-400">
            No devices found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceManagerPage;
