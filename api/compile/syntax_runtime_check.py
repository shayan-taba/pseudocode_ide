import asyncio
import traceback
import io
from api.compile.ib_dp_datatypes.array import Array
from api.compile.ib_dp_datatypes.collection import Collection
from api.compile.ib_dp_datatypes.queue import Queue
from api.compile.ib_dp_datatypes.stack import Stack
from api.compile.ib_dp_datatypes.custom_string import CustomString
from api.compile.pseudo_conversions_utils.assignment_utils import check_valid_variable_assignment
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
        return f"Syntax Error on line {e.lineno}: {e.msg}"

    # Validate variable assignments
    checked_variable_assignments = check_valid_variable_assignment(code_string)
    if not checked_variable_assignments[0]:
        return f"Syntax Error on line {checked_variable_assignments[1]}: The name of the defined variable, '{checked_variable_assignments[2]}', must only contain uppercase alphabetic characters (A-Z) and underscores."

    # Prepare the global scope
    global_scope = {
        "Array": Array,
        "Collection": Collection,
        "Stack": Stack,
        "Queue": Queue,
        "CustomString": CustomString,
        "get_sqrt": get_sqrt,
    }

    # Add test case inputs to the global scope
    for index, input_type in enumerate(test_case_input_names):
        global_scope[input_type["name"]] = parse_value(
            test_case_input_values[index], global_scope
        )

    def exec_with_input_pause():
        try:
            # Create a generator to pause execution at input points
            exec_globals = global_scope.copy()
            exec_locals = {}

            # Create a StringIO object to capture output
            output_buffer = io.StringIO()

            # Redirect standard output to the StringIO object
            import sys

            sys.stdout = output_buffer

            def input_paused(prompt):
                # Await input from the provided handler
                if input_handler:
                    return input_handler(prompt)
                else:
                    return input(prompt)

            # Replace the input function with the custom async handler
            exec_globals["input"] = input_paused
            exec(code_string, exec_globals, exec_locals)

            # Get the captured output from StringIO
            output = output_buffer.getvalue()

            # Reset stdout to its original value
            sys.stdout = sys.__stdout__

            return output

        except Exception as e:
            # Check for special runtime errors before returning the standard message
            special_error_message = special_runtime_errors(str(e))
            if special_error_message:
                return special_error_message

            # Otherwise, handle the general exception
            tb = traceback.TracebackException.from_exception(e)
            relevant_frame = None
            for frame in tb.stack:
                if frame.filename == "<string>":
                    relevant_frame = frame
                    break

            if relevant_frame:
                user_line_number = relevant_frame.lineno
                return f"Runtime Error on Line {user_line_number}: {str(e)}"

            return f"Unexpected error: {str(e)}"

    # Use `await` to directly run the async function
    return exec_with_input_pause()
