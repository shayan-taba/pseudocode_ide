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

  /*const [testResults, setTestResults] = useState<{ 
    status: string; 
    actual: string[]; 
    expected: any; 
    input: any 
  }[]>(
    testCases.map((testCase) => ({
      status: "pending", 
      actual: [], 
      expected: testCase.output, 
      input: testCase.input
    }))
  );*/

  const [testResults, setTestResults] = useState(
    testCases.map((testCase) => ({
      status: "pending",
      actual: [],
      expected: testCase.output,
      input: testCase.input,
    }))
  );

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

  const fetchFromBackend = async (
    input: string,
    run: boolean,
    test_case_index: number
  ) => {
    if (code.trim()) {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudocode: code,
          userInput: input,
          run: run,
          test_case_input: testCases[test_case_index].input,
          test_case_index: test_case_index,
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

  const handleSendInput = async () => {
  setIsPopupOpen(false);
  setWaitingForInput(false); // Hide input box while backend processes
  await fetchFromBackend(userInput, false, testIndexRef.current); // Send user input to backend
  setUserInput(""); // Clear input field
};

const handleBackendResponse = (data: any) => {
  const currentIndex = testIndexRef.current;

  if (!testCases[currentIndex]) {
    console.error("No test case found at index:", currentIndex);
    return;
  }

  setOutput((prev) => [...prev, data.output]); // Append new output

  const currentTest = testCases[currentIndex];

  // Regex to extract outputs after the UUID
  const uuid = "49e7d449-5214-4b8f-8743-888c6009c227";
  const outputRegex = new RegExp(`${uuid}\\s(.*?)(?:\\n|$)`, "g");
  const validOutputs: any = [];
  let match;

  while ((match = outputRegex.exec(data.output)) !== null) {
    validOutputs.push(match[1]);
  }

  // Check for special cases
  let status;
  if (data.output.includes("Syntax Error")) {
    status = "Syntax Error";
  } else if (data.output.includes("Runtime Error")) {
    status = "Runtime Error";
  } else if (validOutputs.length > 1) {
    status = "Fail (Multiple Outputs)";
  } else if (validOutputs[0] === currentTest.output) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  // Update test results
  setTestResults((prevResults) => {
    const updatedResults = [...prevResults];
    updatedResults[currentIndex] = {
      ...updatedResults[currentIndex],
      status,
      actual: validOutputs,
    };
    return updatedResults;
  });

  // Handle input requests or move to the next test case
  if (data.requestingInput) {
    setInputMessage("Please provide input for the program.");
    setIsPopupOpen(true); // Show popup for user input
    setWaitingForInput(true); // Indicate waiting state
  } else if (data.isComplete) {
    testIndexRef.current += 1;
    processNextTestCase(); // Move to the next test case
  }
};

const processNextTestCase = async () => {
  if (testIndexRef.current >= testCases.length) {
    console.log("All test cases processed");
    return; // All test cases are processed
  }

  setWaitingForInput(false); // Reset input state
  setIsComplete(false); // Reset completion state

  await fetchFromBackend("", true, testIndexRef.current); // Process current test case
};


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
            testResults={testResults}
            testCases={testCases}
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
                  testResults={testResults}
                  testCases={testCases}
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
