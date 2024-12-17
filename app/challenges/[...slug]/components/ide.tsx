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
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [expandInstructions, setExpandInstructions] = useState<boolean>(false);
  const [expandEditor, setExpandEditor] = useState<boolean>(false);
  const [expandResults, setExpandResults] = useState<boolean>(false);

  const [instructionState, setInstructionState] = useState<"task" | "solution">(
    "task"
  );

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
      try {
        // Send API request
        const response = await fetch("/api/index/run_code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pseudocode: code, // Your pseudocode
            test_case_input_name: testInputsTypes, // Input name
            test_case_input_value: testCases[test_case_index]?.inputs, // Input value
            test_case_index: test_case_index, // Test case index
          }),
        });

        // Parse the JSON response
        type ApiResponse =
          | { error: string }
          | { result: string; status: string };

        const result: ApiResponse = await response.json();

        // Runtime checks to handle the response properly
        if ("error" in result) {
          console.log("The 'Failed to load resource' warning above was successfully handled.");
          console.log("Handled Error:", result.error);
          handleBackendResponse(result.error);
        } else if ("result" in result && result.status === "success") {
          console.log("Success:", result.result);
          handleBackendResponse(result.result);
        } else {
          console.error("Unexpected response:", result);
          alert("An unexpected error occurred.");
        }
      } catch (error) {
        console.error("Unexpected response:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRunCode = async () => {
    setOutput([]); // Clear previous output
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

  const handleBackendResponse = (data: any) => {
    console.log("may d", data, data);

    const currentIndex = testIndexRef.current;

    if (!testCases[currentIndex]) {
      console.error("No test case found at index:", currentIndex);
      return;
    }

    const uuid = "49e7d449-5214-4b8f-8743-888c6009c227";

    setOutput((prev) => [
      ...prev,
      data.replace(new RegExp(uuid + " ", "g"), ""),
    ]); // Append new output

    const currentTest = testCases[currentIndex];

    // Regex to extract outputs after the UUID
    const outputRegex = new RegExp(`${uuid}\\s(.*?)(?:\\n|$)`, "g");
    const validOutputs: any = [];
    let match;

    while ((match = outputRegex.exec(data)) !== null) {
      validOutputs.push(match[1]);
    }

    // Default to "pending" while waiting for input
    let status: TestResultType["status"] = "Pending";

    if (data.includes("Syntax Error")) {
      status = "Syntax Error";
    } else if (data.includes("Runtime Error")) {
      status = "Runtime Error";
    } else if (validOutputs.length > 1) {
      status = "Fail (Multiple Outputs)";
    } else if (
      data.includes("Error: Pseudocode argument missing") ||
      data.includes("Error: Failed to convert pseudocode to Python") ||
      data.includes("Error during conversion")
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

  const processNextTestCase = async () => {
    if (testIndexRef.current >= testCases.length) {
      console.log("All test cases processed");
      setIsComplete(true);
      return; // All test cases are processed
    }

    setIsComplete(false); // Reset completion state

    setOutput((prev) => [
      ...prev,
      "_".repeat(20) + ` TEST CASE ${testIndexRef.current} ` + "_".repeat(20),
    ]); // Append new output

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
    </div>
  );
};

export default IDE;
