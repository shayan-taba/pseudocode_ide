"use client";

import React, { useState, useEffect } from "react";
import { CircleStackIcon, ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import DataManager from "./components/DataManager";
import FileUploader from "./components/FileUploader";
import Navbar from "../components/nav_bar";

const ManageStorage: React.FC = () => {
  const [localStorageData, setLocalStorageData] = useState<
    { key: string; value: any }[]
  >([]);

  // Load data on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      refreshData();
    }
  }, []);

  const refreshData = () => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("challenge")
    );
    setLocalStorageData(
      keys.map((key) => ({
        key,
        value: JSON.parse(localStorage.getItem(key) || "{}"),
      }))
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6 bg-zinc-950 text-white">
        {/* Page Title with Icon */}
        <div className="flex items-center space-x-4">
          <CircleStackIcon className="h-10 w-10 text-blue-400" />
          <h1 className="text-4xl font-bold">Manage Challenge Data</h1>
        </div>

        {/* About Section */}
        <div className="space-y-4 bg-slate-900 p-4 rounded-lg outine outline-white outline shadow-md">
          <h2 className="text-xl font-semibold">About This Page</h2>
          <p>
            This page allows you to manage the data stored locally in your browser related to challenges you've worked on.
            Data includes:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Progress:</strong> Whether each challenge is marked as complete or not.
            </li>
            <li>
              <strong>Saved Code:</strong> Your saved solutions for each challenge whenever you save your code.
            </li>
          </ul>
          <p>
            The data is stored securely in your browser's <strong>localStorage</strong>. You can:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <ArrowUpTrayIcon className="inline h-5 w-5 text-blue-400" /> <strong>Export:</strong> Download your challenge data for backup.
            </li>
            <li>
              <ArrowUpTrayIcon className="inline h-5 w-5 text-green-400" /> <strong>Import:</strong> Reupload previously exported data.
            </li>
            <li>
              <TrashIcon className="inline h-5 w-5 text-red-400" /> <strong>Delete:</strong> Clear specific or all challenge data.
            </li>
          </ul>
        </div>

        {/* File Uploader */}
        <div className="bg-slate-900 p-4 rounded-lg shadow-md outline-white outline space-y-4">
          <h2 className="text-xl font-semibold">Import Data</h2>
          <p className="text-red-400">
            <ExclamationCircleIcon className="inline h-5 w-5 text-red-400" /> Modifying exported files manually can cause errors or unintended consequences when imported. Only import original files that have been exported using the export features.
          </p>
          <FileUploader onUpload={refreshData} />
        </div>

        {/* Data Manager */}
        <div className="space-y-4 outline-white outline bg-slate-900 p-4 rounded-md shadow-lg">
          <h2 className="text-xl font-semibold">Manage Your Data</h2>
          <DataManager data={localStorageData} onRefresh={refreshData} />
        </div>
      </div>
    </>
  );
};

export default ManageStorage;
