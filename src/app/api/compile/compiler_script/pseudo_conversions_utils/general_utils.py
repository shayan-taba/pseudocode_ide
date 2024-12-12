import ast
import re

indent_amount = 4

whitespace_check_chars = [
    "*",
    "/",
    "+",
    "-",
    "==",
    "!=",
    ">",
    ">=",
    "<",
    "<=",
    "≠",
    "=",
]

reserved_keywords = [
    "input",
    "output"
    # Loops
    "loop",
    "while",
    "until",
    "from",
    "to",
    # Conditionals
    "then",
    "if",
    "else",
    # Special Datatypes
    "int",
    "collection",
    "array",
    "stack",
    "queue",
    # Operators and Comparisons
    "and",
    "AND",
    "or",
    "OR",
    "not",
    "NOT",
    "mod",
    "div",
    # Methods
    "addItem"
    "hasNext",
]

def get_string_indices_ranges(line: str) -> list[tuple]:
    """
    Using regular expression, gets the starting (inclusive) and ending (exlusive) position of string literals in a line of pseudocode and accounts for quotes within strings.

    Args:
        line (str): a string representing a line of pseudocode with no indentation

    Returns:
        list: a list in the tuple format (start, end) where "start" and "end" are the character positions of each string in a line of pseudocode
    """
    string_pattern = r"\".*?\"|\'.*?\'"
    return [(m.start(), m.end()) for m in re.finditer(string_pattern, line)]

def is_char_in_string(pos: int, string_ranges: list[tuple]) -> bool:
    """ 
    Determines and returns whether a character position is in a string in a line of pseudocode.
    
    Args:
        pos (int): the index position of a character in a line of pseudocode
        string_ranges (list[tuple]): A list of tuples which contain the start (inclusive) and end (exlusive) of all strings in a line of pseudocode

    Returns:
        bool: True if the character position is in a string, or the string itself, False otherwise
    """
    
    for start, end in string_ranges:
        if start <= pos < end:
            return True
    return False

def validate_whitespace(line: str) -> tuple:
    string_ranges = get_string_indices_ranges(line)
    token_pattern = r"|".join(
        re.escape(op) for op in sorted(whitespace_check_chars, key=len, reverse=True)
    )

    matches = re.finditer(token_pattern, line)

    for match in matches:
        start, end = match.start(), match.end()

        if is_char_in_string(start, string_ranges):
            continue

        if not has_whitespace_before(line, start) or not has_whitespace_after(
            line, end
        ):
            return (
                False,
                f"The operator {line[start:end]} must be surrounded by whitespaces.",
            )

    return True, None

def has_whitespace_before(line: str, start: int) -> bool:
    return not (start == 0) or line[start - 1].isspace()


def has_whitespace_after(line: str, end: int) -> bool:
    return not (end == len(line)) and line[end].isspace()

import ast

def parse_value(value, global_scope):
    """
    Parses a string and returns the appropriate data type or object.
    
    Args:
        value (str): The input string to parse.
        global_scope (dict): A dictionary of predefined classes or objects.

    Returns:
        Any: The parsed value (e.g., int, float, string, object, etc.).
    """
    # Case 1: Quoted strings (e.g., '"hi"', "'hello'")
    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
        return value[1:-1]  # Strip the quotes and return as a string
    
    # Case 2: Boolean values
    if value == "True":
        return True
    if value == "False":
        return False

    # Case 3: Numeric values (int or float)
    try:
        # Evaluate numbers safely using ast.literal_eval
        literal_value = ast.literal_eval(value)
        if isinstance(literal_value, (int, float)):
            return literal_value
    except (ValueError, SyntaxError):
        pass

    # Case 4: Python objects (e.g., Collection(0,4,5), Queue(...))
    try:
        return eval(value, global_scope)
    except Exception:
        pass

    # Case 5: If nothing matches, treat as a raw string
    return value