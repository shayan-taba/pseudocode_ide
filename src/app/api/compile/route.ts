import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

// Store Python process globally to persist between requests
let pythonProcess: ReturnType<typeof spawn> | null = null;
let bufferedOutput = ""; // Accumulate stdout output
let isWaitingForInput = false;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pseudocode, userInput, run, test_case_input_name, test_case_input_value, test_case_index } = body;

    // If no process exists, spawn a new one
    if (run) {
      bufferedOutput = `________________________________________________\nRUNNING TEST CASE ${test_case_index + 1}\n`;
      isWaitingForInput = false;

      // Use path.join to point to the correct location of app.py
      const scriptPath = path.join(process.cwd(), "src", "app", "api", "compile", "compiler_script", "app.py");

      console.log("THE PATH HERE NOT")
      console.log("THE PATH HERE NOT", scriptPath)

      pythonProcess = spawn("python3", [scriptPath, pseudocode, JSON.stringify(test_case_input_name), JSON.stringify(test_case_input_value)]);

      // Collect output from the Python script
      pythonProcess.stdout?.on("data", (data) => {
        const outputChunk = data.toString();
        bufferedOutput += outputChunk;

        console.log("Python Output:", outputChunk);

        // Detect if Python script is requesting input
        if (outputChunk.includes("The code is requesting your input on line")) {
          isWaitingForInput = true;
          console.log("Waiting for input:", bufferedOutput);
        }
      });

      // Handle errors
      pythonProcess.stderr?.on("data", (data) => {
        console.error("Python Error:", data.toString());
      });

      pythonProcess.on("close", () => {
        console.log("Python process closed.");
        pythonProcess = null;
        isWaitingForInput = false;
      });
    }

    // If process is waiting for input, write the user input
    if (pythonProcess && isWaitingForInput && userInput) {
      if (pythonProcess.stdin) {
        pythonProcess.stdin.write(userInput + "\n");
        isWaitingForInput = false;  // Reset waiting state
      } else {
        console.error("Python process stdin is null.");
      }
    }

    // Wait for more output if process is still running
    if (!isWaitingForInput && pythonProcess) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust waiting strategy if needed
    }

    // Return accumulated output to the frontend
    const response = {
      output: bufferedOutput,
      requestingInput: isWaitingForInput,
      isComplete: !pythonProcess || pythonProcess.killed,
    };

    // Clear buffered output after sending it
    bufferedOutput = "";

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error in compile API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
