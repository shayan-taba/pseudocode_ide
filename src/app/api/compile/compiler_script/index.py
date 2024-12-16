import asyncio
from flask import Flask, request, jsonify
import json
from syntax_runtime_check import syntax_check_and_run_converted
from pseudo_conversions_utils.conversion_compiler import pseudocode_to_python

app = Flask(__name__)

print('nott11s')

# Global state to manage the execution
execution_state = {
    "paused": False,
    "input_prompt": None,
    "pending_input": None,
    "execution_context": None
}

@app.route("/api/index", methods=["POST"])
async def process_pseudocode():
    try:
        execution_state["input_prompt"] = None
        execution_state["pending_input"] = None
        
        data = request.get_json()
        pseudocode = data.get("pseudocode")
        test_case_input_name = data.get("test_case_input_name", None)
        test_case_input_value = data.get("test_case_input_value", None)

        if not pseudocode:
            return jsonify({"error": "Pseudocode argument missing."}), 400

        # Convert pseudocode to Python
        python_code = pseudocode_to_python(pseudocode)
        if not python_code:
            return jsonify({"error": "Failed to convert pseudocode to Python."}), 500

        # Simulate the input handling in the backend
        async def input_handler(prompt):
            execution_state["input_prompt"] = prompt
            print(f"Waiting for input: {prompt}")
            
            # Async wait for input to be set by the frontend
            while execution_state["pending_input"] is None:
                await asyncio.sleep(0.1)  # Non-blocking wait, checks for input periodically
            
            return execution_state["pending_input"]
        
        # Start the execution
        result = await syntax_check_and_run_converted(
            python_code, test_case_input_name, test_case_input_value, input_handler=input_handler
        )

        # If the code is paused due to waiting for input
        if execution_state["paused"]:
            return jsonify({
                "waiting_for_input": True,
                "input_prompt": execution_state["input_prompt"]
            })

        return jsonify({"result": result})

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route("/api/index/input", methods=["POST"])
def handle_user_input():
    try:
        data = request.get_json()
        user_input = data.get("userInput")
        
        if not user_input:
            return jsonify({"error": "User input is required."}), 400

        # Store the user input and resume execution
        execution_state["pending_input"] = user_input
        execution_state["paused"] = False

        # Process the pseudocode again, this time with user input
        return process_pseudocode()

    except Exception as e:
        return jsonify({"error": f"Error handling user input: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/api/index/input-status", methods=["GET"])
def get_input_status():
    # Check if the backend is currently waiting for input
    if execution_state["input_prompt"]:
        return jsonify({"input_prompt": execution_state["input_prompt"]})
    return jsonify({"input_prompt": None})
