// This is a component that enables users to write pseudocode in a colour-formatted editor using the "CodeMirror" library.
// Users run their code by sending it to the back-end API upon processing a run button.
// Users can save their code to the browser's local storage to restore progress through an export button.
// users can return to the prior saved-version through an import button.

import React, { Dispatch, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import { EditorView } from "@uiw/react-codemirror";

import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

import {
  PlayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowDownOnSquareIcon, // Load icon
  ArrowUpOnSquareIcon,   // Save icon
} from "@heroicons/react/24/outline";

import { CodeBracketSquareIcon } from "@heroicons/react/24/outline";

// Define a custom CodeMirror theme to apply consistent styling
const myTheme = createTheme({
  theme: "light",
  settings: {
    background: "",
    backgroundImage: "",
    foreground: "",
    caret: "#ffffff", // Cursor color
    selection: "#000000",
    selectionMatch: "#000000",
    lineHighlight: "#8a91991a",
    gutterBorder: "#1E293B",
    gutterBackground: "#1E293B",
    gutterForeground: "#8a919966",
  },
  styles: [
    { tag: t.comment, color: "#787b8099" },
    { tag: t.variableName, color: "#f5f5f5" },
    { tag: [t.string, t.special(t.brace)], color: "#5c6166" },
    { tag: t.number, color: "#ffffff" },
    { tag: t.bool, color: "#5c6166" },
    { tag: t.null, color: "#5c6166" },
    { tag: t.keyword, color: "#0080ff" },
    { tag: t.operator, color: "#5c6166" },
    { tag: t.className, color: "#5c6166" },
    { tag: t.definition(t.typeName), color: "#5c6166" },
    { tag: t.typeName, color: "#5c6166" },
    { tag: t.angleBracket, color: "#5c6166" },
    { tag: t.tagName, color: "#5c6166" },
    { tag: t.attributeName, color: "#5c6166" },
  ],
});

// Define props interface for the Editor component
interface EditorProps {
  id: number;
  width: string;
  code: string;
  onCodeChange: (value: string) => void;
  onRun: () => void;
  expandEditor: boolean;
  setExpandEditor: Dispatch<React.SetStateAction<boolean>>;
}

const Editor: React.FC<EditorProps> = ({
  id,
  width,
  code,
  onCodeChange,
  onRun,
  expandEditor,
  setExpandEditor,
}) => {
  useEffect(() => {
    // Load saved code from localStorage on initial render
    const key = `challenge-${id}`;
    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.code) {
          onCodeChange(parsedData.code); // Restore code into editor
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, [id, onCodeChange]);

  const handleSave = () => {
    const key = `challenge-${id}`;
    const existingData = localStorage.getItem(key);
    const newData = { code }; // New code to be saved

    let errorOnSave: boolean = false;
    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        const mergedData = { ...parsedData, ...newData };
        localStorage.setItem(key, JSON.stringify(mergedData)); // Merge and save
      } catch (error) {
        errorOnSave = true;
        console.error("Error parsing existing data:", error);
      }
    } else {
      localStorage.setItem(key, JSON.stringify(newData)); // Save new entry
    }

    if (!errorOnSave) {
      alert("Code saved successfully");
    }
  };

  const handleLoad = () => {
    const key = `challenge-${id}`;
    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.code) {
          onCodeChange(parsedData.code); // Load code into editor
        } else {
          alert("No saved code found.");
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    } else {
      alert("No saved code found.");
    }
  };

  return (
    <div
      className={`z-10 container-els ${
        !expandEditor ? "h-[100%]" : ""
      } ${width}`}
    >
      {/* Header section with title and utility buttons */}
      <div className="container-headings text-emerald-400">
        <div className="container-nav-box">
          <div className={"container-navs"}>
            <h1>Pseudocode</h1>
            <CodeBracketSquareIcon className="nav-icons" />
          </div>
        </div>
        <div className="container-utils-box">
          {/* Save button */}
          <button
            onClick={handleSave}
            className="nav-btns px-3 bg-blue-600 hover:bg-blue-700"
          >
            <ArrowUpOnSquareIcon className="nav-icons" />
            <p className="hideSmallScreen">Save</p>
          </button>

          {/* Load button */}
          <button
            onClick={handleLoad}
            className="nav-btns px-3 bg-yellow-600 hover:bg-yellow-700"
          >
            <ArrowDownOnSquareIcon className="nav-icons" />
            <p className="hideSmallScreen">Load Saved Code</p>
          </button>

          {/* Run button */}
          <button
            onClick={onRun}
            className="nav-btns px-3 bg-green-600 hover:bg-green-700"
          >
            <PlayIcon className="nav-icons" />
            <p className="hideSmallScreen">Run</p>
          </button>

          {/* Expand/shrink editor toggle */}
          <button
            onClick={() => setExpandEditor(!expandEditor)}
            className={`nav-btns`}
          >
            {expandEditor ? (
              <ArrowsPointingOutIcon className="nav-icons" />
            ) : (
              <ArrowsPointingInIcon className="nav-icons" />
            )}
          </button>
        </div>
      </div>

      {/* Editor body with CodeMirror */}
      <div className="container-body scrollable-container">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[
            python(), // Syntax highlighting for pseudocode (Python-like)
            autocompletion({ activateOnTyping: false }),
            indentUnit.of("    "), // Indentation style
            EditorView.lineWrapping,
          ]}
          theme={myTheme} // Apply custom theme
          onChange={(value) => onCodeChange(value || "")} // Ensure empty string fallback
        />
      </div>
    </div>
  );
};

export default Editor;
