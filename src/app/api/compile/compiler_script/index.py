from flask import Flask, request, jsonify
import json
from syntax_runtime_check import syntax_check_and_run_converted
from pseudo_conversions_utils.conversion_compiler import pseudocode_to_python

app = Flask(__name__)

print('prior')

@app.route("/api/index", methods=["POST"])
def process_pseudocode():
    print('post prior')

    try:
        # Parse the request JSON
        data = request.get_json()
        pseudocode = data.get("pseudocode")

        test_case_input_name = data.get("test_case_input_name", None)
        test_case_input_value = data.get("test_case_input_value", None)

        if not pseudocode:
            return jsonify({"error": "Pseudocode argument missing."}), 400

        # Convert pseudocode to Python
        try:
            python_code = pseudocode_to_python(pseudocode)
            if not python_code:
                return jsonify({"error": "Failed to convert pseudocode to Python."}), 500
        except Exception as e:
            return jsonify({"error": f"Error during conversion: {str(e)}"}), 500

        # Run the converted Python code
        try:
            print("Executing converted Python code...\n", python_code)
            execution_result = syntax_check_and_run_converted(
                python_code, test_case_input_name, test_case_input_value
            )
            return jsonify({"result": execution_result})  # Ensure the result is in the response
        except Exception as e:
            return jsonify({"error": f"Runtime error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
