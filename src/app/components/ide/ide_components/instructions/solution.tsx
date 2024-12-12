import { useState } from "react";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

interface SolutionProps {
  exampleSolution: string;
}

const Solution: React.FC<SolutionProps> = ({ exampleSolution }) => {
  const [message, setMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const copyText = (text: any) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setMessage("Text copied to clipboard!");
        setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds
      })
      .catch((err) => {
        setMessage("Failed to copy text!");
        console.error("Error copying text: ", err);
      });
  };

  return (
    <div className="space-y-6">
      {/* Warning Section */}
      <div
        className={`gap-3 max-w-[400px] justify-between p-4 border-l-4 rounded-md ${
          showWarning ? "bg-green-100" : "bg-yellow-100"
        } flex items-center space-x-2`}
        style={{ borderColor: showWarning ? "#16a34a" : "#f59e0b" }}
      >
        <ExclamationCircleIcon
          className={`w-[60px] ${
            showWarning ? "text-green-600" : "text-[#f59e0b]"
          }`}
        />
        <div
          className={`font-semibold ${
            showWarning ? "text-green-700" : "text-yellow-600"
          }`}
        >
          {!acknowledged ? (
            <div className="flex flex-col">
              If you view the example solution, you will not be eligible for
              points.
              <button
                onClick={() => {
                  setShowWarning(true);
                  setAcknowledged(true);
                }}
                className="text-blue-500 text-left mt-2 underline hover:underline"
              >
                Acknowledge
              </button>
            </div>
          ) : (
            <>
              You have acknowledged the warning. Proceed with caution.
              <div className="flex flex-col mt-2 space-y-2">
                {/*<button
                  onClick={() => {
                    setShowWarning(false);
                    setAcknowledged(false);
                  }}
                  className="text-red-400 text-left underline hover:underline"
                >
                  Unacknowledge
                </button>*/}
                <button
                  onClick={() => copyText(exampleSolution)}
                  className="w-[max-content] px-3 text-sm py-2 bg-blue-500 rounded-md hover:bg-blue-600 text-white flex items-center space-x-2"
                >
                  <span>Copy Text</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success/Failure Message */}
      {message && (
        <p
          className={`text-lg ${
            message.includes("Failed") ? "text-red-500" : "text-green-300"
          } flex items-center space-x-2`}
        >
          {message.includes("Failed") ? (
            <ExclamationCircleIcon className="w-4 h-4" />
          ) : (
            <CheckCircleIcon className="w-4 h-4" />
          )}
          <span>{message}</span>
        </p>
      )}
    </div>
  );
};

export default Solution;
