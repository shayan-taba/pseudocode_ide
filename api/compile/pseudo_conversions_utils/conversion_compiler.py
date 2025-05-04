"""
pseudo_conversions_utils/conversion_compiler.py
Module that converts pseudocode to Python
Raises SyntaxError if the Pseudocode is deemed to have one.
"""

from api.compile.pseudo_conversions_utils.general_utils import *
from api.compile.pseudo_conversions_utils.input_output_utils import (
    pseudo_input_to_python_input,
    pseudo_output_to_python_print,
)
from api.compile.pseudo_conversions_utils.loop_utils import (
    replace_and_check_from_loop_construct,
)


def pseudocode_to_python(pseudocode: str) -> str:
    conversion = intial_pseudocode_conversion(pseudocode)
    conversion = ib_specific_pseudocode_conversion(conversion)

    return conversion


def ib_specific_pseudocode_conversion(pseudocode: str):
    python_code = []
    for index, line in enumerate(pseudocode.split("\n")):
        string_ranges = get_string_indices_ranges(line)

        if line.strip().startswith("output "): # The user is trying to use output feature
            original_indent = len(line) - len(line.lstrip())
            python_converted_line = (
                " " * original_indent + pseudo_output_to_python_print(line.lstrip())
            )
            python_code.append(python_converted_line)

        elif line.strip().startswith("input "): # The user is trying to use input feature
            original_indent = len(line) - len(line.lstrip())
            try:
                converted_expression = pseudo_input_to_python_input(
                    line.lstrip(), index + 1
                )
                python_converted_line = " " * original_indent + converted_expression
                python_code.append(python_converted_line)
            except SyntaxError as e:
                raise SyntaxError(f"on Line {index+1}: {str(e)}")

        elif line.strip().startswith(
            "loop "
        ):  # If a line still starts with "loop" after prior conversion, it is assumed to be an attempted for loop
            try:
                comment_part = ""  # Default assumes no comment
                pseudocode_part = line  # Default assume whole line is commentless

                for char_index, char in enumerate(
                    line
                ):  # Increments each character in the line.
                    if char == "#" and not is_char_in_string(
                        char_index, string_ranges
                    ):  # Determines if the character is a comment
                        # if it is a "#" not in a string.
                        pseudocode_part = line[
                            :char_index
                        ]  # Everything before the comment
                        # print(pseudocode_part)
                        comment_part = line[char_index:]  # The comment itself
                        break

                python_converted_line = replace_and_check_from_loop_construct(
                    pseudocode_part, string_ranges
                )  # passes a line of pseudocode except for comments to the function tha converts for loops

                pseudocode_part += "comment_part"

                python_code.append(python_converted_line)
            except SyntaxError as e:
                raise SyntaxError(f"on Line {index+1}: {str(e)}")
        else:
            python_code.append(line)

    return "\n".join(python_code)


def intial_pseudocode_conversion(pseudocode: str) -> str:
    # Dictionary mapping pseudocode keywords/symbols to Python equivalents
    direct_mappings = {
        "if": "if",
        " then": ":",
        "else if": "elif",
        "else": "else:",
        "end if": "",
        "loop while": "while",
        "loop until": "while not",
        "end loop": "",
        "//": "#",  # Converts pseudocode-style comments to Python-style
        "≠": "!=",
        "mod": "%",
        "div": "//",
        " AND ": " and ",  # Surrounding spaces prevent replacing inside variable names
        " OR ": "or",
        " NOT ": " not ",
        "false": "False",
        "true": "True",
    }

    # Used to help remove block end statements like "end if" after translation
    pseudocode_block_endings = ["end loop", "end if"]

    python_code = []  # Stores final converted code
    block_statements: list = []  # Keeps track of nested block structures (e.g., if, loop)
    current_indent = 0  # Tracks indentation level

    for line_number, line in enumerate(pseudocode.split("\n")):
        # Get string ranges to avoid replacements inside string literals
        string_ranges = get_string_indices_ranges(line)
        converted_line = line
        endWithColon = False  # Flag to add colon manually

        comment_part = ""  # Stores comment part of the line
        pseudocode_part = line  # Stores line without the comment

        # Separate comment from code, ensuring "#" inside strings isn't counted
        for i, char in enumerate(line):
            if char == "#" and not is_char_in_string(i, string_ranges):
                pseudocode_part = line[:i]
                comment_part = line[i:]
                break

        converted_line = pseudocode_part  # Operate only on non-comment portion

        if line.strip() == "":
            # Handle empty lines (preserve structure)
            if line_number == len(pseudocode.split("\n")) - 1 and block_statements:
                # Check for unclosed block at end of input
                raise SyntaxError(
                    f"on Line {line_number+1}: a `{block_statements[-1][0]}` block statement was opened on line {block_statements[-1][1]}, but it was never closed"
                )
            python_code.append("")
            continue

        # Remove trailing comments from pseudocode
        line_removed_comments = line = re.sub(r"#.*$", "", line)
        line_removed_comments = re.sub(r"//.*$", "", line)

        # Set flag to add colon for loop constructs
        if line.strip().startswith("loop") and " from " not in line.strip():
            endWithColon = True

        # Enforce correct syntax for "if"/"else if" requiring "then"
        elif (
            line.strip().startswith("if") or line.strip().startswith("else if")
        ) and not (line_removed_comments.strip().endswith("then")):
            raise SyntaxError(
                f'on Line {line_number+1}: If statements starting with "if" or "else if" must end with "then"'
            )

        # Track the last opened block for structure validation
        last_opened_block: str = block_statements[-1][0] if block_statements else ""
        last_opened_block_line: int | str = (
            block_statements[-1][1] if block_statements else ""
        )

        # Error hints for common IB pseudocode typos
        if line.strip() in ["endloop", "endif"]:
            raise SyntaxError(
                f'on Line {line_number+1}: `{line.strip()}` is undefined, did you mean {line.strip().replace("end", "end ")}'
            )

        # Reject "elif" as it is not part of IB pseudocode
        if line.strip().startswith("elif "):
            current_indent -= indent_amount
            raise SyntaxError(
                f'on Line {line_number+1}: `elif` is not a defined keyword in IB pseudocode, did you mean "else if"?'
            )

        # Validate block structure for "else if"
        elif line.strip().startswith("else if "):
            current_indent -= indent_amount
            if last_opened_block not in ["if", "else if"]:
                raise SyntaxError(
                    f"on Line {line_number+1}: this `else if` block statement is unexpected as it should suceed a `if` or `else if` statement, but it succeeds the `{last_opened_block}` statement on line {last_opened_block_line}"
                )
            block_statements.pop()
            block_statements.append(("else if", line_number))

        # Validate block structure for "else"
        elif line.strip() == "else":
            current_indent -= indent_amount
            if last_opened_block not in ["if", "else if"]:
                raise SyntaxError(
                    f"on Line {line_number+1}: this `else` block statement is unexpected as it should suceed a `if` or `else if` statement, but it succeeds the `{last_opened_block}` statement on line {last_opened_block_line}"
                )
            block_statements.pop()
            block_statements.append(("else", line_number))

        # Handle "end if" and "end loop" closures with structure validation
        elif line.strip() == "end if":
            current_indent -= indent_amount
            if last_opened_block not in ["if", "else if", "else"]:
                raise SyntaxError(
                    f"on Line {line_number+1}: this `end if` block statement is unexpected as it should suceed a `if`, `else if` or `else` statement, but it succeeds the `{last_opened_block}` statement on line {last_opened_block_line}"
                )
            block_statements.pop()

        elif line.strip() == "end loop":
            current_indent -= indent_amount
            if last_opened_block != "loop":
                raise SyntaxError(
                    f"on Line {line_number+1}: this `end loop` block statement is unexpected as it should suceed a `loop` statement, but it succeeds the `{last_opened_block}` statement on line {last_opened_block_line}"
                )
            block_statements.pop()

        # Check for correct indentation using consistent whitespace levels
        if (len(line) - len(line.lstrip())) != current_indent:
            raise SyntaxError(
                f'on Line {line_number+1}: this line has {abs(len(line) - len(line.lstrip())-current_indent)} {"too many" if (len(line) - len(line.lstrip())-current_indent) > current_indent else "too few"} whitespaces because each indent must be 4 whitespaces or indentation was unexpected'
            )

        # Update indentation and push to block stack for new blocks
        if line.strip().startswith("loop "):
            current_indent += indent_amount
            block_statements.append(("loop", line_number))
        elif line.strip().startswith("if "):
            current_indent += indent_amount
            block_statements.append(("if", line_number))
        elif line.strip().startswith("else if ") or line.strip() == "else":
            current_indent += indent_amount

        # Perform string replacements for pseudocode tokens only outside of strings
        for pseudocode_word, python_word in direct_mappings.items():
            start_pos = 0
            while True:
                start_pos = converted_line.find(pseudocode_word, start_pos)
                if start_pos == -1:
                    break
                if not is_char_in_string(start_pos, string_ranges):
                    converted_line = (
                        converted_line[:start_pos]
                        + python_word
                        + converted_line[(start_pos + len(pseudocode_word)) :]
                    )
                start_pos += len(python_word)

        # Nullify line if it's a block end keyword (already handled)
        for block_end in pseudocode_block_endings:
            start_pos = 0
            while True:
                start_pos = converted_line.find(block_end, start_pos)
                if start_pos == -1:
                    break
                if not is_char_in_string(start_pos, string_ranges):
                    converted_line = None
                start_pos += len(python_word)

        # Add colon for certain loop headers if missing
        if endWithColon:
            if converted_line.endswith(":"):
                raise SyntaxError(
                    f'on Line {line_number+1}: IB CS Pseudocode does not expect ":" (colons) at the end of loop statements'
                )
            converted_line += ":"

        # Add converted line (and preserved comment if any) to output
        (
            python_code.append(converted_line + comment_part)
            if (converted_line or comment_part)
            else python_code.append("")
        )

        # Final check for unclosed blocks
        if line_number == len(pseudocode.split("\n")) - 1 and block_statements:
            raise SyntaxError(
                f"on Line {line_number+1}: The `{block_statements[-1][0]}` block statement opened on line {block_statements[-1][1]+1} was never closed"
            )

    # Join and return full converted code
    return "\n".join(python_code)

