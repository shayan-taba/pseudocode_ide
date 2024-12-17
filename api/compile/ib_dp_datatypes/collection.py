class Collection:
    """A class representing an IB Pseudocde ordered collection of items with iteration functionality.

    The methods support custom error messages. This class allows adding items, iterating through them,
    and checking the state of the collection. It also adds an extra feature to obtain collection length.

    Attributes:
        length (int): The number of items in the collection which is greater than or equal to zero.
    """

    def __init__(self, *values):
        """Initializes the Collection with optional initial values.

        Args:
            values (tuple): Optional initial values to populate the collection.
        """
        # The following are internal attribute properties
        self._items = []  # To store the elements of the collection in an ordered array
        self._current_index = 0  # Used for iteration index in "getNext"
        self._reset_yet = False  # Tracks if resetNext has been called. If so, it is
        # set as True and allows for methods `getNext` and `hasNext` to be used.

        for value in values:
            self._items.append(value)  # Sets initialized values if any

    @property
    def length(self) -> int:
        """Gets the number of items in the collection.

        Returns:
            int: The number of items in the collection.
        """
        return len(self._items)

    def addItem(self, *items) -> None:
        """Adds an item to the end of the collection.

        Args:
            items (tuple): A tuple of items to be added to the collection. Only one item is allowed once processed.

        Raises:
            ValueError: If more than one item is provided to be added to the collection.
        """
        if len(items) != 1:
            raise ValueError(
                f"Expected 1 item to be added to the collection, but {len(items)} items were given."
            )

        self._items.append(items[0])

    def getNext(self):
        """Retrieves the next item in the collection during iteration.

        Raises:
            Exception: If `resetNext` has not been called before starting the iteration.
            StopIteration: If there are no more items to iterate.

        Returns:
            The next item in the collection.
        """
        if not self._reset_yet:
            raise Exception(
                'Before using "getNext" in a collection, you must call "resetNext" to initialize iteration.'
            )

        if self.hasNext():
            item = self._items[self._current_index]
            self._current_index += 1
            return item
        else:
            raise StopIteration("No more items to iterate in the collection.")

    def resetNext(self) -> None:
        """Resets the iteration index to the start of the collection.

        This method must be called before using `getNext` or `hasNext`.
        """
        self._current_index = 0  # Index for first element of collection
        self._reset_yet = (
            True  # Allows for `getNext` and `hasNext` to be used without error,
        )
        # if appropriate arguments are used.

    def hasNext(self) -> bool:
        """Checks if there are more items to iterate over in the collection.

        Raises:
            Exception: If `resetNext` has not been called before starting the iteration.

        Returns:
            bool: True if there are more items, False otherwise.
        """
        if not self._reset_yet:
            raise Exception(
                'Before using "hasNext", you must call "resetNext" to initialize iteration.'
            )
        return self._current_index < len(self._items)

    def isEmpty(self) -> bool:
        """Checks if the collection is empty.

        Returns:
            bool: True if the collection is empty, False otherwise.
        """
        return len(self._items) == 0

    def __repr__(self) -> str:
        """Returns a string representation of the collection if the object of this class is used as a collection.

        Returns:
            str: A string in the format 'Collection([item1, item2, ...])'.
        """
        return f"Collection({self._items})"
