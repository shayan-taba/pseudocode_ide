import traceback
import sys
import io
from ib_dp_datatypes.array import Array
from ib_dp_datatypes.collection import Collection
from ib_dp_datatypes.queue import Queue
from ib_dp_datatypes.stack import Stack
from ib_dp_datatypes.custom_string import CustomString
from pseudo_conversions_utils.assignment_utils import check_valid_variable_assignment
from pseudo_conversions_utils.general_utils import parse_value
from pseudo_conversions_utils.predefined_functions import get_sqrt


def syntax_check_and_run_converted(
    code_string, test_case_input_names: str, test_case_input_values: str
):
    output_capture = io.StringIO()  # Create an in-memory string buffer to capture the output
    sys.stdout = output_capture  # Redirect stdout to capture print statements

    try:
        # Syntax check using compile
        compile(code_string, "<string>", "exec")

    except SyntaxError as e:
        error_line = code_string.splitlines()[e.lineno - 1]  # Get the error containing line
        return f"Syntax Error on line {e.lineno}: {e.msg}"

    checked_variable_assignments = check_valid_variable_assignment(code_string)
    if not checked_variable_assignments[0]:
        return f"Syntax Error on line {checked_variable_assignments[1]}: The name of the defined variable, '{checked_variable_assignments[2]}' must only contain uppercase alphabetic characters (A-Z) and underscores"

    try:
        # Global scope with predefined classes and functions
        global_scope = {
            "Array": Array,
            "Collection": Collection,
            "Stack": Stack,
            "Queue": Queue,
            "CustomString": CustomString,
            "get_sqrt": get_sqrt,
        }

        # Parse and add the test case input value to the global scope
        for index, input_type in enumerate(test_case_input_names):
            global_scope[input_type["name"]] = parse_value(test_case_input_values[index], global_scope)

        # Syntax is valid as no errors have been raised, execute the code and handle input/output
        exec(code_string, global_scope)
    
    except Exception as e:
        # Extract the full traceback
        tb = traceback.TracebackException.from_exception(e)
        relevant_frame = None

        # Search for the frame that corresponds to the user's input code
        for frame in tb.stack:
            if frame.filename == "<string>":  # This corresponds to the user's code
                relevant_frame = frame
                break

        if relevant_frame:
            # Extract the line of user code that caused the issue
            user_line_number = relevant_frame.lineno
            error_line = code_string.splitlines()[user_line_number - 1]  # Assuming each line in pseudocode and Python correspond
            custom_error = special_runtime_errors(str(e))
            
            if custom_error:
                return f"Runtime Error on Line {user_line_number}: {custom_error}\n{error_line.strip()}"
            else:
                return f"Runtime Error on Line {user_line_number}: {str(e)}\n{error_line.strip()}"

        else:
            return f"This is a special error caused by the interpreter itself. Please contact the developer for support. Runtime error: {str(e)}\n{traceback.format_exc()}"
    
    finally:
        sys.stdout = sys.__stdout__  # Restore the original stdout

    # Return the captured output from exec
    return output_capture.getvalue() if output_capture.getvalue() else "\nCode executed successfully."


def special_runtime_errors(error: str) -> str:
    if error == "name 'output' is not defined":
        return "IB Pseuedocode does not have an output function; rather, use `output expression` where `expression` is an expression."
    elif error == "name 'input' is not defined":
        return "IB Pseuedocode does not have an input function; rather, use `input VARIABLE_NAME` where `VARIABLE_NAME` is the name of the variable."
    elif "'str' object has no attribute 'length'" in error:
        return "AttributeError: 'str' object has no attribute 'length'. For strings, use the `len` function similar to Python to obtain the length." 
    else:
        return None
