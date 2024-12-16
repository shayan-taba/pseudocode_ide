"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/nav_bar";
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
  input: any[]; // Input for the test case
};

interface IDEProps {
  id: number;
  title: string;
  description: string;
  hint: string;
  tags: string[];
  difficulty: string;
  testCases: { inputs: string[]; output: string }[]; // Test case structure
  exampleCode: string;
  outputType: any;
  testInputsTypes: {
    name: string;
    type: string;
  }[];
}

const IDE: React.FC<IDEProps> = ({
  id,
  title,
  description,
  hint,
  tags,
  difficulty,
  testCases,
  exampleCode,
  outputType,
  testInputsTypes,
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

  const pollerRef = useRef<number | null>(null);
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
      input: testCase.inputs,
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
      const response = await fetch("/api/index/run_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudocode: code,
          test_case_input_name: testInputsTypes,
          test_case_input_value: testCases[test_case_index].inputs,
          test_case_index: test_case_index,
        }),
      });
      console.log("prior json", response, response.ok);
      const data = await response.json();

      if (response.ok) {
        handleBackendResponse(data);
      } else {
        console.error("Internal Server Error");
        alert("Internal Server Error. Please reload and try again.");
      }
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
        input: testCase.inputs,
      }))
    ); // Reset test results to their initial state

    processNextTestCase();
  };

  const handleSendInput = async () => {
    setIsPopupOpen(false);
    setWaitingForInput(false); // Hide input box while backend processes
    await sendInputToBackend(userInput);
    setUserInput(""); // Clear input field
  };

  const handleBackendResponse = (data: any) => {
    console.log("may d", data, data.result);

    const currentIndex = testIndexRef.current;

    if (!testCases[currentIndex]) {
      console.error("No test case found at index:", currentIndex);
      return;
    }

    const uuid = "49e7d449-5214-4b8f-8743-888c6009c227";

    console.log(
      "replaceded",
      data.result.replace(new RegExp(uuid + " ", "g"), "")
    );
    setOutput((prev) => [
      ...prev,
      data.result.replace(new RegExp(uuid + " ", "g"), ""),
    ]); // Append new output

    const currentTest = testCases[currentIndex];

    // Regex to extract outputs after the UUID
    const outputRegex = new RegExp(`${uuid}\\s(.*?)(?:\\n|$)`, "g");
    const validOutputs: any = [];
    let match;

    while ((match = outputRegex.exec(data.result)) !== null) {
      validOutputs.push(match[1]);
    }

    // Default to "pending" while waiting for input
    let status: TestResultType["status"] = "Pending";

    if (data.result.includes("Syntax Error")) {
      status = "Syntax Error";
    } else if (data.result.includes("Runtime Error")) {
      status = "Runtime Error";
    } else if (validOutputs.length > 1) {
      status = "Fail (Multiple Outputs)";
    } else if (
      data.result.includes("Error: Pseudocode argument missing") ||
      data.result.includes("Error: Failed to convert pseudocode to Python") ||
      data.result.includes("Error during conversion")
    ) {
      status = "Special Error";
    } else if (validOutputs[0] === currentTest.output) {
      status = "Pass";
    } else {
      status = "Fail";
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

    console.log("notisreq");
    // Once the test completes, move to the next test case
    testIndexRef.current += 1;
    // console.log(testCases[currentIndex]);
    processNextTestCase(); // Move to the next test case
  };

  // Function to send input back to the backend
  async function sendInputToBackend(inputValue: string) {
    console.log("SENDING INPUT", inputValue);
    const response = await fetch("/api/index/send-input", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: inputValue, // The input provided by the user
      }),
    });
    console.log("GOT INPUT");
    const data = await response.json();
    console.log("GOT INPUTs");
    console.log(data.result);
  }

  async function pollForInput() {
    if (pollerRef.current !== null) return; // Avoid multiple pollers

    try {
      pollerRef.current = window.setInterval(async () => {
        console.log("Polling for input...");
        const response = await fetch("/api/index/input-status");
        const data = await response.json();

        if (data.input_prompt) {
          stopPolling(); // Stop polling if input is requested

          setInputMessage(data.input_prompt);
          setIsPopupOpen(true);
          setWaitingForInput(true);
        }
      }, 2200); // Poll every 2.2 seconds
    } catch (error) {
      console.error("Error polling for input:", error);
      stopPolling(); // Ensure polling stops on error
    }
  }

  function stopPolling() {
    if (pollerRef.current !== null) {
      clearInterval(pollerRef.current); // No type mismatch now
      pollerRef.current = null; // Reset to null
    }
  }

  // Start polling when the page loads or when needed
  pollForInput();

  const processNextTestCase = async () => {
    if (testIndexRef.current >= testCases.length) {
      console.log("All test cases processed");
      setIsComplete(true);
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
    hint: hint,
    tags: tags,
    difficulty: difficulty,
    testCases: testCases,
    expandInstructions: expandInstructions,
    setExpandInstructions: setExpandInstructions,
    instructionState: instructionState,
    toggleInstructionState: toggleInstructionState,
    outputType: outputType,
    inputName: testInputsTypes,
    exampleSolution: exampleCode,
    completeStatus: completeStatus,
    testInputsTypes: testInputsTypes,
  };

  const editorArgs = {
    id: id,
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
    setCompleteStatus: setCompleteStatus,
    testInputsTypes: testInputsTypes,
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
            <Instructions width={"w-[40%]"} {...instructionArgs} />

            <div className="divider flex flex-col flex-grow justify-between gap-6 w-[60%]">
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
