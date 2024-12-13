import React from "react";
import SavedItem from "./SavedItem";

interface DataManagerProps {
  data: { key: string; value: any }[];
  onRefresh: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ data, onRefresh }) => {
  const exportData = () => {
    const challengeData = data.filter((item) =>
      item.key.startsWith("challenge")
    );
    const blob = new Blob([JSON.stringify(challengeData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "challengeData.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllChallenges = () => {
    if (confirm("Are you sure you want to delete all 'challenge' data?")) {
      data.forEach((item) => {
        if (item.key.startsWith("challenge")) {
          localStorage.removeItem(item.key);
        }
      });
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={exportData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export Challenge Data
        </button>
        <button
          onClick={clearAllChallenges}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All Challenge Data
        </button>
      </div>
      <div className="space-y-4">
        {data
          .filter((item) => item.key.startsWith("challenge"))
          .map((item) => (
            <SavedItem key={item.key} item={item} onRefresh={onRefresh} />
          ))}
      </div>
    </div>
  );
};

export default DataManager;
