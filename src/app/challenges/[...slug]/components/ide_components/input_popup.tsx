import React from "react";
import ReactDOM from "react-dom";

interface PopupProps {
  isOpen: boolean;
  userInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  message: string;
}

const Popup: React.FC<PopupProps> = ({ isOpen, userInput, onInputChange, onSubmit, message }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Enter Input</h2>
        <h3 className="mb-2 text-base">{message.split("\n").pop()}</h3>
        <input
          type="text"
          value={userInput}
          onChange={onInputChange}
          className="w-full p-2 border rounded mb-4 outline outline-gray-500"
        />
        <button
          onClick={onSubmit}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Popup;
