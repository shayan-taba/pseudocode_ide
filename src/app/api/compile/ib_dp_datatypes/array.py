class Array:
    """A class representing an IB Pseudocode array-like structure with methods for managing its size and values and handling errors.

    This class provides methods to set the array length, initialize values, and access or modify elements
    by index, following a simplified array-like behavior. It also adds an extra feature to obtain collection length.

    The array must either complete its initializion through set_length or initialize_values.
    Afterwards recieves a fixed length.
    Only one of these two methods must be used directly after initialization and then can no longer be used.
    Only after that, values can only be set through "Array[index] = expression".

    Public Attributes:
        length (int | None): The number of elements in the array, which must be larger or equal to zero, or None (read-only).
    """

    def __init__(self, *values):
        """Initializes an array. If no values are provided, it is empty and must be furher initalized through the method set_length or initialize_values.

        The following variables are for private use only.
        """
        self._data = None  # An internal property attribute that is default to None.
        # Once the length of the Array is fixed, this becomes a standard Python list.
        # It contains the items of Array.
        self._length = 0
        self._initialized = False # Only True after methods set_length or initialize_values is successfully
        # called. Once True, the internal property prevents either method to be reused. This restricts the only
        # way to set values as Array[index] = expression.
        
        if values:
            self.initialize_values(*values)

    @property
    def length(self) -> int | None:
        """Gets the length of the array.

        Returns:
            int | None: The number of elements in the array, which must be larger or equal to zero, or None (read-only).
        """
        return self._length

    def set_length(self, length_being_set: int) -> None:
        """Sets the length of the array and preallocates space with "None" values.

        Args:
            length_being_set (int): The desired length of the array. Must be an integer greater or equal to zero.

        Raises:
            ValueError: If the length is set after initialization or if the length is not valid.
        """

        if self._initialized:
            raise ValueError("Length cannot be set after the array is initialized.")
        if not isinstance(length_being_set, int) or length_being_set < 0:
            raise ValueError("Length must be a non-negative and non-zero integer.")
        self._length = length_being_set
        self._data = [None] * length_being_set  # Preallocate space.
        self._initialized = True

    def initialize_values(self, *values) -> None:
        """Initializes the array with the provided values and automatically sets the length.

        Args:
            values (tuple): A tuple of values to initialize the array. Each value should only be a supported type.

        Raises:
            ValueError: If values are set after the array is initialized.
            TypeError: If any value is of an unsupported data type.
        """
        if self._initialized:
            raise ValueError("Values can only be set when the array is first created.")

        self._length = len(values)
        self._data = list(values)
        
        for value in values:
            if not isinstance(
                value, (int, float, str, bool, list, dict, None.__class__)
            ):
                raise TypeError(
                    "Unsupported data type is attempted to being added to array."
                )

        self._initialized = True

    def __getitem__(self, index: int):
        """Retrieves the value at the specified index.

        Args:
            index (int): The index of the element to retrieve.

        Raises:
            IndexError: If the index is out of bounds.

        Returns:
            The value stored at the specified index.
        """
        if index < 0 or index >= self._length:
            raise IndexError(
                f"Index {index} is outside the range for this array of length {self._length}."
            )
        return self._data[index]

    def __setitem__(self, index: int, value) -> None:
        """Sets the value at the specified index.

        Args:
            index (int): The index of the element to update.
            value: The value to assign to the specified index.

        Raises:
            IndexError: If the index is out of bounds.
        """
        if index < 0 or index >= self._length:
            raise IndexError(
                f"Index {index} is outside the range for this array of length {self._length}."
            )
        self._data[index] = value

    def __repr__(self) -> str:
        """Returns a string representation of the array when an object of this class is an expression.

        Returns:
            str: A string in the format 'Array([item1, item2, ...])'.
        """
        return f"Array({self._data})"
