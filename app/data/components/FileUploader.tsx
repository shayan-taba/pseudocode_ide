import React from "react";

interface FileUploaderProps {
  onUpload: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.key && item.value && item.key.startsWith("challenge")) {
              localStorage.setItem(item.key, JSON.stringify(item.value));
            }
          });
          alert("Challenge data successfully uploaded!");
          onUpload();
        } else {
          alert("Invalid file format. Please upload a JSON file.");
        }
      } catch (error) {
        alert("Error reading file. Please ensure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <label className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700">
        Import JSON
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUploader;
