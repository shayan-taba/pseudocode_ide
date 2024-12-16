import asyncio
from flask import Flask, request, jsonify
import json
import time
from api.compile.syntax_runtime_check import syntax_check_and_run_converted
from api.compile.pseudo_conversions_utils.conversion_compiler import pseudocode_to_python

app = Flask(__name__)

print("nott11s")

# Global state to manage the execution
execution_state = {
    "paused": False,
    "input_prompt": None,
    "pending_input": None,
    "execution_context": None,
}


@app.route("/api/index/run_code", methods=["POST"])
def process_pseudocode():
    print("374853", "api/index/run_code")
    try:
        execution_state["input_prompt"] = None
        execution_state["pending_input"] = None

        data = request.get_json()
        pseudocode = data.get("pseudocode")
        test_case_input_name = data.get("test_case_input_name", None)
        test_case_input_value = data.get("test_case_input_value", None)
        test_case_index = data.get("test_case_index", None)

        if not pseudocode:
            return jsonify({"error": "Pseudocode argument missing.", "code": 400})

        # Convert pseudocode to Python
        python_code = pseudocode_to_python(pseudocode)
        if not python_code:
            return jsonify(
                {"error": "Failed to convert pseudocode to Python.", "code": 500}
            )

        # Simulate the input handling in the backend
        def input_handler(prompt):
            execution_state["input_prompt"] = prompt
            print(f"Waiting for input: {prompt}")

            # Async wait for input to be set by the frontend
            while execution_state["pending_input"] is None:
                time.sleep(0.1)  # Non-blocking wait, checks for input periodically

            temporary_input = execution_state["pending_input"]
            execution_state["pending_input"] = None
            
            return temporary_input

        # Start the execution
        result = syntax_check_and_run_converted(
            python_code,
            test_case_input_name,
            test_case_input_value,
            input_handler=input_handler,
        )

        return jsonify({"result": result, "code": 200})

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}", "code": 500})


@app.route("/api/index/send-input", methods=["POST"])
def handle_user_input():
    print("374853", "api/index/send-input")
    try:
        data = request.get_json()
        user_input = data.get("userInput")

        if not user_input:
            return jsonify({"error": "User input is required.", "code": 400})

        # Store the user input and resume execution
        execution_state["pending_input"] = user_input
        execution_state["input_prompt"] = None

        execution_state["paused"] = False

        return jsonify({"code": 200})

    except Exception as e:
        return jsonify({"error": f"Error handling user input: {str(e)}", "code": 500})


@app.route("/api/index/input-status", methods=["GET"])
def get_input_status():
    print("374853", "api/index/input-status")
    # Check if the backend is currently waiting for input
    if execution_state["input_prompt"]:
        return jsonify({"input_prompt": execution_state["input_prompt"]})
    return jsonify({"input_prompt": None})
