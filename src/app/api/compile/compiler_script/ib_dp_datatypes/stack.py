class Stack:
    """A class representing an IB Pseudocde LIFO stack.

    The methods support custom error messages. This class allows adding standard methods (push, pop, isEmpty).
    It also adds an extra feature to obtain collection length.

    Attributes:
        length (int): The number of items in the collection which is greater than or equal to zero.
    """

    def __init__(self, *items: tuple):
        """Create the stack as an object with pre-initialized items where provided in the paramaters.

        Args:
            items (tuple): a tuple representing all the arguments passed to be initially added to the stack,
            however, only one is expected to be enqueued.
        """
        self._items = []  # For internal use only, items are handled in a list.
        for item in items:
            self._items.append(item) # The first arguments passed with be in the front of the stack and last to be poped.

    @property
    def length(self) -> int:
        """Gets the number of items in the collection.

        Returns:
            int: The number of items in the collection.
        """
        return len(self._items)

    def push(self, *items: tuple):
        """Push an item onto the end of the LIFO stack.
        
        Raises:
            TypeError: occurs if more than one argument is provided
            
        Args:
            items (tuple): a tuple representing values to be added to the end of the stack, however, only one should be given. 
        """
        
        if len(items) != 1:
            raise ValueError(
                f"Expected 1 item to be pushed to the end of the stack, but {len(items)} items were given."
            )
        else:
            self._items.append(items[0])

    def pop(self):
        """Pop the last item off the stack, replicating LIFO behaviour, and returns the value. Raises an error if the stack is empty.
        
        Raises:
            IndexError: occurs if the stack if already empty.
        """
        if self.isEmpty():
            raise IndexError("Pop from an empty stack")
        return self._items.pop(-1)

    def isEmpty(self):
        """Returns True if empty. Otherwise, False."""
        return len(self._items) == 0

    def __repr__(self):
        """When the object is used as an expression, it invokes this method to provide an output of the items of the LIFO stack"""
        return f"Stack({', '.join(self._items)})"
