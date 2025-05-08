"""syntax_runtime_check.py"""
import traceback
import io
from api.compile.ib_dp_datatypes.array import Array
from api.compile.ib_dp_datatypes.collection import Collection
from api.compile.ib_dp_datatypes.queue import Queue
from api.compile.ib_dp_datatypes.stack import Stack
from api.compile.ib_dp_datatypes.custom_string import CustomString
from api.compile.pseudo_conversions_utils.assignment_utils import (
    check_valid_variable_assignment,
)
from api.compile.pseudo_conversions_utils.general_utils import parse_value
from api.compile.pseudo_conversions_utils.predefined_functions import get_sqrt


def special_runtime_errors(error: str) -> str:
    """
    Return special error messages for pseudocode-specific issues.
    """
    if error == "name 'output' is not defined":
        return "IB Pseuedocode does not have an output function; rather, use `output expression` where `expression` is an expression."
    elif error == "name 'input' is not defined":
        return "IB Pseuedocode does not have an input function; rather, use `input VARIABLE_NAME` where `VARIABLE_NAME` is the name of the variable."
    elif error == "'str' object has no attribute 'length'":
        return "AttributeError: 'str' object has no attribute 'length'. For strings, use the `len` function similar to Python to obtain the length."
    else:
        return None


def syntax_check_and_run_converted(
    code_string,
    test_case_input_names: str,
    test_case_input_values: str,
    input_handler=None,
):
    """
    Executes the converted pseudocode, handling pauses for user input.
    :param code_string: The converted Python code.
    :param test_case_input_names: The test case input variable names.
    :param test_case_input_values: The test case input values.
    :param input_handler: A callback function to handle user input when needed.
    :return: Result of execution or error message.
    """
    try:
        # Syntax check using compile
        compile(code_string, "<string>", "exec")

    except SyntaxError as e:
        error_line = code_string.splitlines()[e.lineno - 1]
        raise SyntaxError(f"on Line {e.lineno}: {e.msg}")

    # Validate variable assignments
    checked_variable_assignments = check_valid_variable_assignment(code_string)
    if not checked_variable_assignments[0]:
        raise SyntaxError(
            f"on Line {checked_variable_assignments[1]}: The name of the defined variable, '{checked_variable_assignments[2]}', must only contain uppercase alphabetic characters (A-Z) and underscores."
        )

    def exec_with_runtime_error_handling():
        """This runs if a syntax error has not been found in the converted code.
        
        Handles runtime errors during execution and maps them back to the original pseudocode line if possible.

        Raises:
            RuntimeError: _description_
            Exception: _description_

        Returns:
            _type_: _description_
        """
        try:
            # Prepare the global scope with built-in types and functions used in pseudocode
            global_scope = {
                "Array": Array,
                "Collection": Collection,
                "Stack": Stack,
                "Queue": Queue,
                "CustomString": CustomString,
                "get_sqrt": get_sqrt,
                "letters": Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z")
            }

            # Map each test case input into the global scope for execution
            for index, input_type in enumerate(test_case_input_names):
                global_scope[input_type["name"]] = parse_value(
                    test_case_input_values[index], global_scope
                )

            # Create isolated environments for exec (code string execution)
            exec_globals = global_scope.copy()
            exec_locals = {}

            # Redirect stdout to capture output
            output_buffer = io.StringIO()
            import sys
            sys.stdout = output_buffer  # Temporarily redirect print output

            # Execute the code string in the prepared scope
            exec(code_string, exec_globals, exec_locals)

            # Retrieve printed output
            output = output_buffer.getvalue()

            # Reset stdout back to default
            sys.stdout = sys.__stdout__

            return output

        except Exception as e:
            # Exception handling block catches any runtime error raised in exec()

            # Check for known custom errors (e.g. divide by 0) and convert them to user-friendly messages
            special_error_message = special_runtime_errors(str(e))

            # Extract traceback to find where in the user's code the error occurred
            tb = traceback.TracebackException.from_exception(e)
            relevant_frame = None
            for frame in tb.stack:
                if frame.filename == "<string>":  # Indicates user-submitted code
                    relevant_frame = frame
                    break

            if relevant_frame:
                user_line_number = relevant_frame.lineno
                # Raise a clean, user-friendly error with the original pseudocode line number.
                raise RuntimeError(
                    f"on Line {user_line_number}: {special_error_message if special_error_message else str(e)}"
                )

            # If no specific user line was found, raise a general error message
            raise Exception(f"{str(e)}")

    return exec_with_runtime_error_handling()

