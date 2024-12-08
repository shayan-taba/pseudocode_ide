import re
from .general_utils import *
from .assignment_utils import check_valid_variable_name


def pseudo_output_to_python_print(line: str) -> str:
    subtracted_start = len("output ")
    ouput_values = re.split(" , |, | ,|,", line.rstrip()[subtracted_start:])
    python_conversion = (
        f"print({', '.join([ouput_value for ouput_value in ouput_values])})"
    )
    return python_conversion


def pseudo_input_to_python_input(line: str, lineNumber) -> tuple:
    subtracted_start = len("input ")

    input_values = re.split(" , |, | ,|,", line.rstrip()[subtracted_start:])

    if len(input_values) == 0:
        raise Exception(
            "The input keyword must be placed before one or more variable names separated by commas"
        )

    for input_value in input_values:
        check_valid_variable_name(input_value)

    python_conversion = (
        f"{';'.join([(input_value + f" = input('The code is requesting your input on line {str(lineNumber)}')") for input_value in input_values])}"
    )

    return python_conversion

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
