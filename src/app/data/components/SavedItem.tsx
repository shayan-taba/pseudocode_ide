import React from "react";

interface SavedItemProps {
  item: { key: string; value: object };
  onRefresh: () => void;
}

const SavedItem: React.FC<SavedItemProps> = ({ item, onRefresh }) => {
  const deleteItem = () => {
    if (confirm(`Are you sure you want to delete "${item.key}"?`)) {
      localStorage.removeItem(item.key);
      onRefresh();
    }
  };

  return (
    <div className="p-4 border rounded shadow space-y-2">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">{item.key}</h2>
        <button
          onClick={deleteItem}
          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      <pre className="bg-slate-800 p-2 rounded">
        {JSON.stringify(item.value, null, 2)}
      </pre>
    </div>
  );
};

export default SavedItem;
