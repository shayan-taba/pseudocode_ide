import ast
from api.compile.pseudo_conversions_utils.general_utils import *


def check_valid_variable_name(name: str) -> bool:

    if name in reserved_keywords:
        raise SyntaxError(
            f'The variable name, "{name}", must not be identical to a reserved keyword'
        )
    elif " " in name or not re.match(r"^[A-Z_]+$", name):
        raise SyntaxError(
            f'The name of the defined variable, "{name}", must only contain uppercase alphabetic characters (A-Z) and underscores'
        )

    return True  # No issue with the variable name


def check_valid_variable_assignment(code: str) -> tuple:
    tree = ast.parse(code)

    # Variable names will be put here
    defined_variables = []

    # Iterate through the AST nodes
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):  # True if node is assignment, i.e., "="
            for (
                target
            ) in (
                node.targets
            ):  # Iterates through each token in the assignment section of the code
                if isinstance(
                    target, ast.Name
                ):  # Ensure that the token is a variable name
                    defined_variables.append(
                        (target.id, node.lineno)
                    )  # Record the variable in the list and its line number

    try:
        for defined_variable in defined_variables:
            # defined_variable[0] is the variable name.
            # defined_variable[1] is the line number of the assignment.
            check_valid_variable_name(defined_variable[0])
    except SyntaxError as e:
        return (
            False,
            defined_variable[1],
            defined_variable[0],
        )  # Return False, and the line number of the first insatnce of invalid variable names, and the variable name
    return (True, None)  # No issues with any variable names
