"""This module provides utility functions for the conversion pseudocode loops into python.
In doing so, it handle loop-specific syntax errors.

Raises:
    SyntaxError: if arrangement of loop is wrong or the variable name is invalid for for loop.
Returns:
    _type_: _description_
"""

import re
from api.compile.pseudo_conversions_utils.general_utils import *
from api.compile.pseudo_conversions_utils.assignment_utils import (
    check_valid_variable_name,
)


def replace_and_check_from_loop_construct(line: str, string_ranges: list) -> str:
    loop_pattern = r"loop ([A-Z_]+) from (.+) to (.+)"
    match = re.search(
        loop_pattern, line
    )  # Checks that the from "loop" format is appropriate with appropriate variable names
    if match:
        variable, start_expr, end_expr = match.groups()

        # Ensure expressions to be modified are not inside strings
        if not is_char_in_string(match.start(), string_ranges):
            python_loop = f"for {variable} in range({start_expr.strip()}, {end_expr.strip()} + 1):"
            return re.sub(loop_pattern, python_loop, line, count=1)
    else:
        if not re.search(
            r".+ from .+", line
        ):  # Checks the "from" is actually present in the statement
            raise SyntaxError(
                'The loop must be either of the "while", "until", or "from" format'
            )
        elif len(line.strip()) > 2:
            try:
                if check_valid_variable_name(
                    line.strip().split()[1]
                ):
                    pass 
            except SyntaxError as e: # The code seems to be a `for loop` but the counter variable name does not follow standard
                raise SyntaxError(str(e))

    return line
