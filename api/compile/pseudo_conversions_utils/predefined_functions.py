"""This file defines certain functions that will be accessible to the pseudocode. 
This is to provide the end-user with certain features simply to develop their pseudocode"""

import math

def get_sqrt(INTEGER: int) -> float:
    """When this function is accessed in the pseudocode, the converted python code invokes this function.
    This function is used in pseudocode challenges were the user should be able to easily compute the squareroot of an integer.

    Args:
        INTEGER (int): The integer the user wants to compute the squareroot.

    Returns:
        float: The squareroot of INTEGER.
    """
    return math.sqrt(INTEGER)