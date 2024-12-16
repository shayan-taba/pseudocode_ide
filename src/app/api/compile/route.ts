import { NextResponse } from "next/server";
import fetch from "node-fetch";

// Store buffered output globally
let bufferedOutput = "";
let isWaitingForInput = false;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pseudocode, userInput, run, test_case_input_name, test_case_input_value, test_case_index } = body;

    // If running a new test case
    if (run) {
      bufferedOutput = `________________________________________________\nRUNNING TEST CASE ${test_case_index + 1}\n`;
      isWaitingForInput = false;

      // Send POST request to Flask server for pseudocode processing
      const response = await fetch("http://localhost:5328/api/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudocode,
          test_case_input_name,
          test_case_input_value,
        }),
      });

      const result: any = await response.json();

      console.log(result, "MAI R")

      if (response.ok) {
        bufferedOutput += result.result || "No output from Python script.";
      } else {
        bufferedOutput += `Error: ${result.error || "Unknown error"}`;
      }
    }

    // If Flask is waiting for input, send the user input (mimicking the previous logic)
    if (isWaitingForInput && userInput) {
      const response = await fetch("http://localhost:5328/api/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudocode,
          test_case_input_name,
          test_case_input_value,
          userInput,
        }),
      });

      const result: any = await response.json();
      bufferedOutput += result.result || "No output from Python script.";
      isWaitingForInput = false; // Reset after sending input
    }

    // Wait for more output if process is still running (optional, based on your logic)
    if (!isWaitingForInput) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust waiting strategy if needed
    }

    // Return accumulated output to the frontend
    const response = {
      output: bufferedOutput,
      requestingInput: isWaitingForInput,
      isComplete: true, // Assuming Flask handles the process completion
    };

    // Clear buffered output after sending it
    bufferedOutput = "";

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error in compile API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
