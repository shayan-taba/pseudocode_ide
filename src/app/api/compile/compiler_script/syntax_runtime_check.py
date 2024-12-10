import traceback
from ib_dp_datatypes.array import Array
from ib_dp_datatypes.collection import Collection
from ib_dp_datatypes.queue import Queue
from ib_dp_datatypes.stack import Stack
from pseudo_conversions_utils.assignment_utils import check_valid_variable_assignment


def syntax_check_and_run_converted(code_string, test_case_input):
    global_scope = {
        "Array": Array,
        "Collection": Collection,
        "Stack": Stack,
        "Queue": Queue,
        "TEST_CASE": str(
            test_case_input
        ),  # This is the input variable for the code challenge, or "None" for the
        # standard IDE "playground".
    }
    
    try:
        # Syntax check using compile
        compile(code_string, "<string>", "exec")

        # Defining global execution with additional classes imported to help with defining advanced datatypes

    except SyntaxError as e:
        error_line = code_string.splitlines()[
            e.lineno - 1
        ]  # Get the error containing line
        return (
            f"Syntax error on line {e.lineno}: {e.msg}\n"
            # f"Error in line:\n{error_line}\n"
            # f"{' ' * (e.offset - 1)}^"
            # Find where the error was from
        )

    checked_variable_assignments = check_valid_variable_assignment(code_string)
    # in tuple checked_variable_assignments, the first item is boolean of success, the second item is line number, the third item is variable name
    if not checked_variable_assignments[0]:
        return f"Syntax error on line {checked_variable_assignments[1]}: The name of the defined variable, '{checked_variable_assignments[2]}, must only contain uppercase alphabetic characters (A-Z) and underscores"

    try:
        # Syntax is valid as not errors have been raised, execute the code and handle input/output
        exec(code_string, global_scope)
    except Exception as e:
        # Extract the full traceback
        tb = traceback.TracebackException.from_exception(e)
        relevant_frame = None

        # Search for th frame that corresponds to the user's input code rather than errors raised in ib_dp_datatype files
        for frame in tb.stack:
            if frame.filename == "<string>":  # This corresponds to the user's code
                relevant_frame = frame
                break

        if relevant_frame:
            # Extract the line of user code that caused the issue
            user_line_number = relevant_frame.lineno
            error_line = code_string.splitlines()[
                user_line_number - 1
            ]  # Assuming each line in psuedocode and python are corresponding,
            # this code gets the pseudocode line relevant to  the Python runtime error

            if custom_error := special_runtime_errors(str(e)):
                return (
                    f"Runtime Error on Line {user_line_number}: {custom_error}\n"
                    # f"Error occurred in file: {frame_info.filename}, "
                    # f"Line Number: {user_line_number}\n"
                    # f"{error_line.strip()}\n"
                    # f"in function {frame_info.function}"
                )

            else:
                return (
                    f"Runtime Error on Line {user_line_number}: {str(e)}\n"
                    # f"Line Number: {user_line_number}\n"
                    f"{error_line.strip()}\n"
                )
        else:
            # Otherwise, the error comes from the ib_dp_database file code rather than directly the user's code. This is an extreme edge case.
            return f"This is a special error caused by the interpreter itself. Please contact the developer for support. Runtime error: {str(e)}\n{traceback.format_exc()}"

    else:

        return "\nCode executed successfully."


def special_runtime_errors(error: str) -> str:
    if error == "name 'output' is not defined":
        return "IB Psuedocode does not have an output function; rather, use `output expression` where `expression` is an expression."
    if error == "name 'input' is not defined":
        return "IB Psuedocode does not have an input function; rather, use `input VARIABLE_NAME` where `VARIABLE_NAME` is the name of the variable."
    else:
        return None
