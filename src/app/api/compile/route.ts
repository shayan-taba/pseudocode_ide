import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

// Store Python process globally to persist between requests
let pythonProcess: ReturnType<typeof spawn> | null = null;
let bufferedOutput = ""; // Accumulate stdout output
let isWaitingForInput = false;

export async function POST(req: Request) {
  const body = await req.json();
  const { pseudocode, userInput } = body;

  // If no process exists, spawn a new one

  //console.log("pythonProcess STAT", pythonProcess);

  if (!pythonProcess) {
    
    const scriptPath = path.join(process.cwd(), "src/app/api/compile", "app.py");
    pythonProcess = spawn("python3", [scriptPath, pseudocode]);

    // Collect output from the Python script
    if (pythonProcess.stdout) {
      pythonProcess.stdout.on("data", (data) => {
        const outputChunk = data.toString();
        bufferedOutput += outputChunk;

        console.log("Python Output:", outputChunk);

        // Detect if Python script is requesting input
        if (outputChunk.includes("The code is requesting your input on line")) {
          isWaitingForInput = true;
        }
      });
    } else {
      console.error("Python process stdout is null.");
    }

    // Handle errors
    if (pythonProcess.stderr) {
      pythonProcess.stderr.on("data", (data) => {
        console.error("Python Error:", data.toString());
      });
    } else {
      console.error("Python process stderr is null.");
    }

    // Reset process on close
    pythonProcess.on("close", () => {
      pythonProcess = null;
      isWaitingForInput = false;
      //bufferedOutput = "";
    });
  }

  // If the process is waiting for input, send the user input
  if (isWaitingForInput && userInput) {
    if (pythonProcess.stdin) {
      pythonProcess.stdin.write(userInput + "\n");
      isWaitingForInput = false; // Reset waiting state
    } else {
      console.error("Python process stdin is null.");
    }
  }

  // Wait for more output if the process is still running
  if (!isWaitingForInput && pythonProcess) {
    // Check if there’s new output
    await new Promise((resolve) => setTimeout(resolve, 100)); // Delay to gather output
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
}
