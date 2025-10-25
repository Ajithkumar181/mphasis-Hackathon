import React, { useState } from "react";
import { CheckCircle, XCircle, RefreshCw, Search, FileText, Shield, Clock, Download } from "lucide-react";

// Mock file data
const mockFiles = [
  { id: "F001", name: "ProjectPlan.pdf", hash: "abc123", status: "Pending", retries: 0, timestamp: null, size: "2.4 MB" },
  { id: "F002", name: "Report.docx", hash: "def456", status: "Pending", retries: 0, timestamp: null, size: "1.8 MB" },
  { id: "F003", name: "Presentation.pptx", hash: "ghi789", status: "Pending", retries: 0, timestamp: null, size: "5.2 MB" },
  { id: "F004", name: "Budget.xlsx", hash: "jkl012", status: "Verified", retries: 1, timestamp: "14:23:45", size: "3.1 MB" },
  { id: "F005", name: "Backup.zip", hash: "mno345", status: "Corrupted", retries: 2, timestamp: "14:20:12", size: "15.7 MB" },
];

const IntegrityPage = () => {
  const [files, setFiles] = useState(mockFiles);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Simulate hash verification
  const verifyFile = (fileId) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === fileId) {
          const isValid = Math.random() > 0.3; // 70% chance of success
          const status = isValid ? "Verified" : "Corrupted";
          const timestamp = new Date().toLocaleTimeString();

          // Add to logs
          setLogs((prevLogs) => [
            { ...file, status, timestamp, retries: file.retries + 1 },
            ...prevLogs.slice(0, 49) // Keep only last 50 logs
          ]);

          setMessage(
            <div className="flex items-center gap-2">
              {status === "Verified" ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span>
                <strong>{file.name}</strong> {status === "Verified" ? "verified successfully" : "detected as corrupted"}
              </span>
            </div>
          );
          setTimeout(() => setMessage(""), 4000);

          return { ...file, status, retries: file.retries + 1, timestamp };
        }
        return file;
      })
    );
  };

  // Verify all files
  const verifyAllFiles = () => {
    files.forEach(file => {
      if (file.status === "Pending") {
        setTimeout(() => verifyFile(file.id), Math.random() * 1000);
      }
    });
  };

  // Filtered files based on search and status
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         file.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || file.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    const configs = {
      Verified: {
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        icon: CheckCircle
      },
      Corrupted: {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        icon: XCircle
      },
      Pending: {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-800",
        icon: Clock
      }
    };
    return configs[status] || configs.Pending;
  };

  const stats = {
    total: files.length,
    verified: files.filter(f => f.status === "Verified").length,
    corrupted: files.filter(f => f.status === "Corrupted").length,
    pending: files.filter(f => f.status === "Pending").length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              File Integrity Verification
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Monitor and verify the integrity of your files
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={verifyAllFiles}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              <Shield className="w-4 h-4" />
              Verify All Pending
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Files
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.verified}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Verified
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.corrupted}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Corrupted
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Message */}
        {message && (
          <div className="fixed top-6 right-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 max-w-sm z-50 animate-in slide-in-from-right-full duration-500">
            {message}
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search files by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Corrupted">Corrupted</option>
          </select>
        </div>

        {/* File Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredFiles.map((file) => {
            const statusConfig = getStatusConfig(file.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={file.id} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600">
                {/* File Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                        {file.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                        {file.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* File Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Size</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{file.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Retries</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{file.retries}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-4 ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {file.status}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => verifyFile(file.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  {file.status === "Pending" ? "Verify Integrity" : "Re-verify"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
              No files found
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              Try adjusting your search terms or filters
            </div>
          </div>
        )}

        {/* Logs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Verification Logs
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Retries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log, index) => {
                  const statusConfig = getStatusConfig(log.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {log.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {log.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${statusConfig.bg} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {log.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {log.retries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {log.timestamp}
                      </td>
                    </tr>
                  );
                })}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <div className="text-gray-400 dark:text-gray-500 text-sm">
                        No verification logs yet. Verify some files to see logs here.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrityPage;