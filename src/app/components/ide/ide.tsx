"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./ide_components/nav_bar";
import Instructions from "./ide_components/instructions/instructions";
import Editor from "./ide_components/editor/editor";
import Results from "./ide_components/results/results";
import Popup from "./ide_components/input_popup";

import "./ide_styles.css";
// pages/code-editor.tsx

interface IDEProps {
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testCases: { input: any; output: any }[]; // Test case structure
}

const IDE: React.FC<IDEProps> = ({
  title,
  description,
  tags,
  difficulty,
  testCases,
}) => {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [expandInstructions, setExpandInstructions] = useState<boolean>(false);
  const [expandEditor, setExpandEditor] = useState<boolean>(false);
  const [expandResults, setExpandResults] = useState<boolean>(false);

  const [inputMessage, setInputMessage] = useState<string>("");

  const [instructionState, setInstructionState] = useState<"task" | "solution">(
    "task"
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const pollerRef = useRef<NodeJS.Timeout | null>(null);
  const testIndexRef = useRef<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const toggleInstructionState = () => {
    setInstructionState((prevState) =>
      prevState === "task" ? "solution" : "task"
    );
  };

  const [resultState, setResultState] = useState<"outcome" | "output">(
    "outcome"
  );

  const toggleResultsState = () => {
    setResultState((prevState) =>
      prevState === "outcome" ? "output" : "outcome"
    );
  };

  useEffect(() => {
    if (!testCases) {
      testIndexRef.current = -1; // -1 means playground mode
    }
  }, [testCases]);

  useEffect(() => {
    if (expandInstructions) {
      setExpandEditor(false);
      setExpandResults(false);
    }
  }, [expandInstructions]);

  useEffect(() => {
    if (expandEditor) {
      setExpandInstructions(false);
      setExpandResults(false);
    }
  }, [expandEditor]);

  useEffect(() => {
    if (expandResults) {
      setExpandInstructions(false);
      setExpandEditor(false);
    }
  }, [expandResults]);

  const fetchFromBackend = async (input: string, run: boolean, test_case_index: number) => {
    if (code.trim()) {
      const testCaseInput =
        testIndexRef.current !== -1 ? testCases[testIndexRef.current].input : undefined;

      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudocode: code,
          userInput: input,
          run: run,
          test_case_input: testCaseInput,
          test_case_index: test_case_index
        }),
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
    testIndexRef.current = 0; // Start from the first test case

    processNextTestCase();
  };

  const processNextTestCase = async () => {
    if (testIndexRef.current >= testCases.length) {
      return; // All test cases are processed
    }

    setWaitingForInput(false); // Reset input state
    setIsComplete(false); // Reset completion state

    await fetchFromBackend("", true, testIndexRef.current); // Process current test case
  };

  const handleSendInput = async () => {
    setIsPopupOpen(false);
    setWaitingForInput(false); // Hide input box while backend processes
    await fetchFromBackend(userInput, false, 0); // Send user input to backend
    setUserInput(""); // Clear input field
  };

  const handleBackendResponse = (data: any) => {
    if (data.output) {
      setInputMessage(data.output);
      setOutput((prev) => [...prev, data.output]); // Append new output
    }

    setWaitingForInput(data.requestingInput); // Update input request state
    setIsComplete(data.isComplete); // Update completion state

    if (data.isComplete && !data.requestingInput) {
      testIndexRef.current += 1; // Move to the next test case
      processNextTestCase();
    }
  };

  useEffect(() => {
    console.log("outcal",output)
  }, [output]);

  useEffect(() => {
    setIsPopupOpen(waitingForInput);

    if (waitingForInput || isComplete) {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    } else {
      pollerRef.current = setInterval(async () => {
        await fetchFromBackend("", false, 0); // Poll backend with no additional input
      }, 500); // Adjust polling interval as needed (500ms here)
    }

    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, [waitingForInput, isComplete]);

  return (
    <div id="IDE" className="flex flex-col h-screen bg-zinc-950">
      <Navbar />
      <div id="IDE_Panel" className="flex flex-row flex-grow overflow-hidden">
        {expandInstructions && (
          <Instructions
            width={"w-[100%] m-5"}
            title={title}
            description={description}
            tags={tags}
            difficulty={difficulty}
            testCases={testCases}
            expandInstructions={expandInstructions}
            setExpandInstructions={setExpandInstructions}
            instructionState={instructionState}
            toggleInstructionState={toggleInstructionState}
          />
        )}

        {expandEditor && (
          <Editor
            width={"w-[100%] m-5"}
            code={code}
            onCodeChange={setCode}
            onRun={handleRunCode}
            expandEditor={expandEditor}
            setExpandEditor={setExpandEditor}
          />
        )}

        {expandResults && (
          <Results
            width={"w-[100%] m-5"}
            output={output}
            isComplete={isComplete}
            onClearOutput={() => setOutput([])}
            expandResults={expandResults}
            setExpandResults={setExpandResults}
            resultState={resultState}
            toggleResultsState={toggleResultsState}
          />
        )}

        {!expandInstructions && !expandEditor && !expandResults && (
          <>
            <Instructions
              width={"w-1/4"}
              title={title}
              description={description}
              tags={tags}
              difficulty={difficulty}
              testCases={testCases}
              expandInstructions={expandInstructions}
              setExpandInstructions={setExpandInstructions}
              instructionState={instructionState}
              toggleInstructionState={toggleInstructionState}
            />

            <div className="divider flex flex-col flex-grow justify-between gap-6 w-[75%]">
              <div className="h-[49%]">
                <Editor
                  width={"flex-grow"}
                  code={code}
                  onCodeChange={setCode}
                  onRun={handleRunCode}
                  expandEditor={expandEditor}
                  setExpandEditor={setExpandEditor}
                />
              </div>
              <div className="h-[49%] flex-grow">
                <Results
                  width={"flex-grow"}
                  output={output}
                  isComplete={isComplete}
                  onClearOutput={() => setOutput([])}
                  expandResults={expandResults}
                  setExpandResults={setExpandResults}
                  resultState={resultState}
                  toggleResultsState={toggleResultsState}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Popup
        isOpen={isPopupOpen}
        userInput={userInput}
        onInputChange={handleInputChange}
        onSubmit={handleSendInput}
        message={inputMessage}
      />
    </div>
  );
};

export default IDE;
