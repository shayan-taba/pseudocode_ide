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
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

import { CodeBracketSquareIcon } from "@heroicons/react/24/outline";

const myTheme = createTheme({
  theme: "light",
  settings: {
    background: "",
    backgroundImage: "",
    foreground: "",
    caret: "#ffffff", // this is the cursor color
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
          onCodeChange(parsedData.code);
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, [id, onCodeChange]);

  const handleSave = () => {
    const key = `challenge-${id}`;
    const existingData = localStorage.getItem(key);
    const newData = { code }; // Data to save

    let errorOnSave: boolean = false;
    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        const mergedData = { ...parsedData, ...newData };
        localStorage.setItem(key, JSON.stringify(mergedData));
      } catch (error) {
        errorOnSave = true;
        console.error("Error parsing existing data:", error);
      }
    } else {
      localStorage.setItem(key, JSON.stringify(newData));
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
          onCodeChange(parsedData.code);
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
      <div className="container-headings text-emerald-400">
        <div className="container-nav-box">
          <div className={"container-navs"}>
            <h1>Pseudocode</h1>
            <CodeBracketSquareIcon className="nav-icons" />
          </div>
        </div>
        <div className="container-utils-box">
          <button
            onClick={handleSave}
            className="nav-btns px-3 bg-blue-600 hover:bg-blue-700"
          >
            <ArrowUpOnSquareIcon className="nav-icons" />
            <p className="hideSmallScreen">Save</p>
          </button>

          <button
            onClick={handleLoad}
            className="nav-btns px-3 bg-yellow-600 hover:bg-yellow-700"
          >
            <ArrowDownOnSquareIcon className="nav-icons" />
            <p className="hideSmallScreen">Load</p>
          </button>

          <button
            onClick={onRun}
            className="nav-btns px-3 bg-green-600 hover:bg-green-700"
          >
            <PlayIcon className="nav-icons" />
            <p className="hideSmallScreen">Run</p>
          </button>

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
      <div className="container-body scrollable-container">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[
            python(),
            autocompletion({ activateOnTyping: false }),
            indentUnit.of("    "),
            EditorView.lineWrapping,
          ]}
          theme={myTheme}
          onChange={(value) => onCodeChange(value || "")} // Ensure `value` is never `undefined`
        />
      </div>
    </div>
  );
};

export default Editor;
