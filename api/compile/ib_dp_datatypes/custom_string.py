class CustomString(str):
    """This is a subclass of the standard Python string that supports
    all the standard method and properties. However, it adds a "length"
    property to ensure consistency in pseudocode. This is to avoid users
    having to use the python function "len" inside the pseudocode.

    Args:
        str (str): This makes CustomString a subclass of string.

    Public Attributes:
        length (int | None): The number of elements in the string.
    """

    @property
    def length(self):
        """Get length of string.

        Returns:
            length of string as integer.
        """
        return len(self)
