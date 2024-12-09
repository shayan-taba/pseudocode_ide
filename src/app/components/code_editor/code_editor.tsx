"use client";

import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentUnit } from "@codemirror/language"
import { autocompletion } from "@codemirror/autocomplete";
import { useRouter } from "next/navigation";

import { HomeIcon, EyeSlashIcon, EyeIcon, PlayIcon, TrashIcon, PauseIcon } from "@heroicons/react/24/solid";
import "./code_editor_style.css"

import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { Router } from "next/router";

const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: '',
    backgroundImage: '',
    foreground: '#c084fc',
    caret: '#5d00ff',
    selection: '#000000',
    selectionMatch: '#036dd626',
    lineHighlight: 'rgb(31 41 55)',
    gutterBorder: 'rgb(17 24 39)',
    gutterBackground: 'rgb(17 24 39)',
    gutterForeground: '#8a919966',
    fontSize: "18px"
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#f5f5f5' },
    { tag: [t.string, t.special(t.brace)], color: '#f3f3f3' },
    { tag: t.number, color: '#c084fc' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: t.keyword, color: '#90f5ff' },
    { tag: t.operator, color: '#5c6166' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#5c6166' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
  ],
});


const CodeEditor: React.FC = () => {
  const router = useRouter();

  const [code, setCode] = useState<string>(""); // Editor content
  const [output, setOutput] = useState<string[]>([]); // Accumulated output
  const [userInput, setUserInput] = useState<string>(""); // User input
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false); // Input request state
  const [isComplete, setIsComplete] = useState<boolean>(false); // Script completion state

  const [showTask, setShowTask] = useState<boolean>(true); // Toggle Task Description
  const [showEditor, setShowEditor] = useState<boolean>(true); // Toggle Editor
  const [showOutput, setShowOutput] = useState<boolean>(true); // Toggle Output

  
  // Calculate widths dynamically
  const getSectionWidths = () => {
    const visibleSections = [showTask, showEditor, showOutput].filter(Boolean).length;
    if (visibleSections === 3) return { taskW: "w-1/5", editorW: "w-3/5", outputW: "w-1/5" };
    if (visibleSections === 2) {
      if (!showTask) return { taskW: "hidden", editorW: "w-2/3", outputW: "w-1/3" };
      if (!showOutput) return { taskW: "w-1/3", editorW: "w-2/3", outputW: "hidden" };
      return { taskW: "w-1/5", editorW: "w-3/5", outputW: "w-1/5" };
    }
    if (visibleSections === 1) {
      if (showTask) return { taskW: "w-full", editorW: "hidden", outputW: "hidden" };
      if (showEditor) return { taskW: "hidden", editorw: "w-full", outputW: "hidden" };
      return { taskW: "hidden", editorW: "hidden", outputW: "w-full" };
    }
    return { taskW: "hidden", editorW: "hidden", outputW: "hidden" };
  };

  const { taskW, editorW, outputW } = getSectionWidths();
  console.log(getSectionWidths())

  const fetchFromBackend = async (input: string, run: boolean) => {
    if (code.trim()) {
      console.log("mai c", code)
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudocode: code, userInput: input, run: run }),
      });

      const data = await response.json();
      handleBackendResponse(data);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRunCode = async () => {
    setOutput([]); // Clear previous output
    setWaitingForInput(false); // Reset input state
    setIsComplete(false); // Reset completion state
    await fetchFromBackend("", true); // Start execution with no input
  };

  const handleSendInput = async () => {
    setWaitingForInput(false); // Hide input box while backend processes
    await fetchFromBackend(userInput, false); // Send user input to backend
    setUserInput(""); // Clear input field
  };

  const handleBackendResponse = (data: any) => {
    console.log(data)
    if (data.output) {
      setOutput((prev) => [...prev, data.output]); // Append new output
    }

    setWaitingForInput(data.requestingInput); // Update input request state
    setIsComplete(data.isComplete); // Update completion state
  };

  useEffect(() => {
    if (!waitingForInput && !isComplete) {
      const interval = setInterval(async () => {
        await fetchFromBackend("", false); // Poll backend with no additional input
      }, 500); // Adjust polling interval as needed (500ms here)
      return () => clearInterval(interval); // Clear polling interval when done
    }
  }, [waitingForInput, isComplete]);

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between bg-gray-800 text-white">
        <div className={`nav-els ${taskW != "hidden" ? taskW : "pr-6"}`}>
          <button
            onClick={() => router.push("/challenges")}
            className="nav-btns"
          >
            <HomeIcon className="nav-icons" />
          </button>
          <button
            onClick={() => setShowTask(!showTask)}
            className={`${showTask ? "" : ""} nav-btns`}
          >
            {showTask ? <EyeIcon className="nav-icons" /> : <EyeSlashIcon className="nav-icons" />}
          </button>
        </div>

        <div className={`nav-els ${"flex-grow"/*editorW != "hidden" ? editorW: "w-4/5"*/}`}>
          <button
            onClick={handleRunCode}
            className="nav-btns bg-emerald-600 hover:bg-emerald-700"
          >
            <PlayIcon className="nav-icons" />Run
          </button>
        </div>

        <div className={`nav-els ${outputW != "hidden" ? outputW : ""}`}>
          <h1 className="text-lg font-bold">Output Tools</h1>
          <button
            onClick={() => setShowOutput(!showOutput)}
            className={`nav-btns ${showOutput ? "" : ""}`}
          >
            {showOutput ? <EyeIcon className="nav-icons" /> : <EyeSlashIcon className="nav-icons" />}
          </button>
          <button
            onClick={() => setOutput([])}
            className="nav-btns"
          >
            <TrashIcon className="nav-icons"/>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="overflow-hidden border-t-4 border-gray-300 flex flex-grow">
        {/* Task Description */}
        {showTask && (
          <div className={`outline-2 outline outline-gray-300 flex flex-col bg-gray-800 ${taskW} p-4 overflow-y-auto`}>
            <h2 className="text-lg font-bold mb-2">Task Description</h2>
            <p>
              Enter pseudocode in the editor. Once ready, press "Run Code" to execute the code and
              see the output.
            </p>
          </div>
        )}

        {/* Code Editor */}
        {showEditor && (
          <div className={`outline-2 outline outline-gray-300 flex flex-col ${editorW == undefined ? "flex-grow": editorW } bg-gray-900 p-4 overflow-y-scroll`}>
            <CodeMirror
              value={code}
              height="100%"
              extensions={[python(), autocompletion({ activateOnTyping: false }), indentUnit.of("    ")]}
              theme={myTheme}
              onChange={handleEditorChange}
            />
          </div>
        )}

        {/* Output Section */}
        {showOutput && (
          <div className={`outline-2 outline outline-gray-300 flex flex-col ${outputW} bg-gray-800 p-4 overflow-y-auto`}>
            <h2 className="text-lg font-bold mb-2">Output</h2>
            <pre
              className="text-white p-4 rounded overflow-auto"
              style={{
                whiteSpace: "pre-wrap", // Allows text wrapping
                wordWrap: "break-word", // Breaks long words
              }}
            >
              {output.join("\n")}
            </pre>
            {waitingForInput && (
              <div className="mt-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter input"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleSendInput}
                  className="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                >
                  Submit Input
                </button>
              </div>
            )}
            {isComplete && <p className="text-green-200 mt-4">Execution Completed</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
