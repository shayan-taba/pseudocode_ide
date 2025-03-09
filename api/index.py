"""API Handler for converting and executing pseudocode in python alongisde the input testcase variables."""

from flask import Flask, request, jsonify
from api.compile.syntax_runtime_check import syntax_check_and_run_converted
from api.compile.pseudo_conversions_utils.conversion_compiler import (
    pseudocode_to_python,
)

app = Flask(__name__)


@app.route("/api/index/run_code", methods=["POST"])
def process_pseudocode():
    """POST API Handler that takes pseudocode and input variables.
    It converts pseudocode to python. If there is an issue, it returns a specific syntax error.
    If there is no syntax error, the converted pyton code is run along with the presdeind input variables.
    If there is no runtime error, it returns the output of the executed code alongisde the input variables.

    Returns:
        string: JSON format string of error status and output if successfully ran
    """
    try:
        # Validate request payload
        if not request.is_json:
            return jsonify({"error": "Invalid JSON payload"}), 400

        # Extract request data
        data = request.get_json()
        pseudocode = data.get("pseudocode")
        test_case_input_name = data.get("test_case_input_name", None)
        test_case_input_value = data.get("test_case_input_value", None)
        test_case_index = data.get("test_case_index", None)

        # Validate pseudocode input
        if not pseudocode:
            return jsonify({"error": "Pseudocode argument is missing or empty"}), 400

        # Convert pseudocode to Python
        try:
            python_code = pseudocode_to_python(pseudocode)
        except SyntaxError as e:
            return jsonify({"error": f"Syntax Error {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": f"Conversion Error: {str(e)}"}), 500

        # Execute the Python code
        try:
            result = syntax_check_and_run_converted(
                python_code, test_case_input_name, test_case_input_value
            )
        except SyntaxError as e:
            return jsonify({"error": f"Syntax Error {str(e)}"}), 400
        except RuntimeError as e:
            return jsonify({"error": f"Runtime Error {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": f"Execution Error: {str(e)}"}), 500

        return jsonify({"result": result, "status": "success"}), 200 # The conversion and execution was successful. The output is provided alongside a positive status.

    except Exception as e: # Unexpected Error
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
