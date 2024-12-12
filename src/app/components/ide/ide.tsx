"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./ide_components/nav_bar";
import Instructions from "./ide_components/instructions/instructions";
import Editor from "./ide_components/editor/editor";
import Results from "./ide_components/results/results";
import Popup from "./ide_components/input_popup";

import "./ide_styles.css";
// pages/code-editor.tsx

export type TestResultType = {
  status:
    | "Pass"
    | "Fail"
    | "Pending"
    | "Syntax Error"
    | "Runtime Error"
    | "Fail (Multiple Outputs)"
    | "Special Error";
  actual: string[]; // Array of actual outputs
  expected: any; // Expected output (type depends on your test case structure)
  input: any; // Input for the test case
};

interface IDEProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testCases: { input: string; output: string }[]; // Test case structure
  exampleCode: string;
  inputType: any;
  outputType: any;
  inputName: string;
}

const IDE: React.FC<IDEProps> = ({
  id,
  title,
  description,
  tags,
  difficulty,
  testCases,
  exampleCode,
  inputType,
  outputType,
  inputName,
}) => {
  const [completeStatus, setCompleteStatus] = useState<boolean | undefined>();
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

  const [testResults, setTestResults] = useState<TestResultType[]>(
    testCases.map((testCase) => ({
      status: "Pending",
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
          test_case_input_name: inputName,
          test_case_input_value: testCases[test_case_index].input,
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
    setTestResults(
      // Reset test results
      testCases.map((testCase) => ({
        status: "Pending",
        actual: [],
        expected: testCase.output,
        input: testCase.input,
      }))
    ); // Reset test results to their initial state

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

    const uuid = "49e7d449-5214-4b8f-8743-888c6009c227";

    setOutput((prev) => [...prev, data.output.replace(uuid + " ", "")]); // Append new output

    const currentTest = testCases[currentIndex];

    // Regex to extract outputs after the UUID
    const outputRegex = new RegExp(`${uuid}\\s(.*?)(?:\\n|$)`, "g");
    const validOutputs: any = [];
    let match;

    while ((match = outputRegex.exec(data.output)) !== null) {
      validOutputs.push(match[1]);
    }

    // Default to "pending" while waiting for input
    let status: TestResultType["status"] = "Pending";

    if (data.output.includes("Syntax Error")) {
      status = "Syntax Error";
    } else if (data.output.includes("Runtime Error")) {
      status = "Runtime Error";
    } else if (validOutputs.length > 1) {
      status = "Fail (Multiple Outputs)";
    } else if (
      data.output.includes("Error: Pseudocode argument missing") ||
      data.output.includes("Error: Failed to convert pseudocode to Python") ||
      data.output.includes("Error during conversion")
    ) {
      status = "Special Error";
    } else if (validOutputs[0] === currentTest.output) {
      status = "Pass";
    } else {
      status = "Fail";
    }

    if (!data.isComplete) {
      status = "Pending";
    }

    // Update test results with the status of the current test
    setTestResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[currentIndex] = {
        ...updatedResults[currentIndex],
        status,
        actual: validOutputs.length > 1 ? validOutputs[0] : validOutputs,
      };
      return updatedResults;
    });

    // Handle input requests or move to the next test case
    if (data.requestingInput) {
      setInputMessage("Please provide input for the program.");
      setIsPopupOpen(true); // Show popup for user input
      setWaitingForInput(true); // Indicate waiting state
    } else if (data.isComplete) {
      // Once the test completes, move to the next test case
      testIndexRef.current += 1;
      // console.log(testCases[currentIndex]);
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

  const instructionArgs = {
    id: id,
    title: title,
    description: description,
    tags: tags,
    difficulty: difficulty,
    testCases: testCases,
    expandInstructions: expandInstructions,
    setExpandInstructions: setExpandInstructions,
    instructionState: instructionState,
    toggleInstructionState: toggleInstructionState,
    inputType: inputType,
    outputType: outputType,
    inputName: inputName,
    exampleSolution: exampleCode,
    testResults: testResults,
    completeStatus: completeStatus,
  };

  const editorArgs = {
    code: code,
    onCodeChange: setCode,
    onRun: handleRunCode,
    expandEditor: expandEditor,
    setExpandEditor: setExpandEditor,
  };

  const resultsArgs = {
    id: id,
    output: output,
    isComplete: isComplete,
    onClearOutput: () => setOutput([]),
    expandResults: expandResults,
    setExpandResults: setExpandResults,
    resultState: resultState,
    toggleResultsState: toggleResultsState,
    testResults: testResults,
    testCases: testCases,
    setCompleteStatus: setCompleteStatus,
  };

  return (
    <div id="IDE" className="flex flex-col h-screen bg-zinc-950">
      <Navbar />
      <div id="IDE_Panel" className="flex flex-row flex-grow overflow-hidden">
        {expandInstructions && (
          <Instructions width={"w-[100%] m-5"} {...instructionArgs} />
        )}

        {expandEditor && <Editor width={"w-[100%] m-5"} {...editorArgs} />}

        {expandResults && <Results width={"w-[100%] m-5"} {...resultsArgs} />}

        {!expandInstructions && !expandEditor && !expandResults && (
          <>
            <Instructions width={"w-[35%]"} {...instructionArgs} />

            <div className="divider flex flex-col flex-grow justify-between gap-6 w-[65%]">
              <div className="h-[49%]">
                <Editor width={"flex-grow"} {...editorArgs} />
              </div>
              <div className="h-[49%] flex-grow">
                <Results width={"flex-grow"} {...resultsArgs} />
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
