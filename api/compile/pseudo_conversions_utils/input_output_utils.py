"""pseudo_conversions_utils/input_output_utils.py
Converts "output" to Python print function. If input is used, raises a syntax error.

Raises:
    SyntaxError: if "input" feature is used. This is not required for pseudocode challenges.

Returns:
    str: the converted line in Python.
"""

import re
from api.compile.pseudo_conversions_utils.general_utils import *
from api.compile.pseudo_conversions_utils.assignment_utils import (
    check_valid_variable_name,
)


def pseudo_output_to_python_print(line: str) -> str:
    subtracted_start = len("output ")
    ouput_values = re.split(" , |, | ,|,", line.rstrip()[subtracted_start:])
    python_conversion = (
        f"print('49e7d449-5214-4b8f-8743-888c6009c227',{', '.join([ouput_value for ouput_value in ouput_values])})"
        ## uuid to signal output
    )
    return python_conversion


def pseudo_input_to_python_input(line: str, lineNumber) -> tuple:

    raise SyntaxError("The standard 'input' feature in pseudocode is not supported by this compiler. However, it is unnecessary for solving any pseudocode challenges, as test-case input methods will always be provided in the IDE.")

def modify_input_statements(code, lineNumber):
    # Regular expression to match `input()` calls with or without variable assignment
    pattern = r"(?:(\w+)\s*=\s*)?input\s*\((.*)\)"

    def replacer(match):
        var_name = match.group(1)  # Extract variable name if present
        input_content = match.group(2)  # Extract the input string or expression
        # Add "[Modified] " to the start of the input string
        modified_input = f'input("The code is requesting your input on line {str(lineNumber)}: " + {str(input_content)})'
        if var_name:
            return f"{var_name} = {modified_input}"
        return modified_input

    # Apply the regular expression replacement to the code
    return re.sub(pattern, replacer, code)
