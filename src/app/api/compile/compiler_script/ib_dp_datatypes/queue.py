from typing import Any

class Queue:
    """A class representing an IB Pseudocde FIFO queue.

    The methods support custom error messages. This class allows adding standard methods (enqueue, dequeue, checkEmpty).
    It also adds an extra feature to obtain collection length.

    Attributes:
        length (int): The number of items in the collection which is greater than or equal to zero.
    """


    def __init__(self, *items):
        """
        Initialize an empty Queue object and populate it with values if they are are provided as arguments.
        Args:
            items (tuple): a tuple representing all the arguments passed, however, only one is expected to be enqueued.
        """
        self._items = [] # Internal attribute property that stores the items in a Python list.

        for item in items:
            self._items.append(item) # The first arguments passed with be in the front of the queue and first to be dequeued.

    @property
    def length(self) -> int:
        """Gets the number of items in the collection.

        Returns:
            int: The number of items in the collection.
        """
        print(len(self._items))
        
    def enqueue(self, *items: tuple) -> None:
        """adds an item to the end of the queue that would be last to be dequeued due to FIFO

        Args:
            items (tuple): a tuple representing all the arguments passed, however, only one is expected to be enqueued.

        Raises:
            TypeError: occurs if more than one argument is provided
        """

        if len(items) != 1:
            raise ValueError(
                f"Expected 1 item to be enqueued to the end of the queue, but {len(items)} items were given."
            )
        else:
            self._items.append(items[0])

    def dequeue(self, *items) -> Any:
        """Remove and return an item from the front of the queue. Raises an error if the queue is empty.

        Args:
            items (tuple): a tuple representing all the arguments passed, however, none are expected for this method.

        Raises:
            TypeError: occurs if any arguments are proivded
            IndexError: occurs if the queue if already empty

        Returns:
            the value of the item remaining in the queue that was first added
        """

        if items:
            raise ValueError(
                f"Expected zero arguments in order to dequeue and return the first enqueued item, but {len(items)} items were given."
            )
        if self.isEmpty():
            raise IndexError("It is not possible to dequeue an queue that is empty.")
        return self._items.pop(0)

    def isEmpty(self) -> bool:
        """Check if the queue is empty.
        
        Returns:
            A boolean that is True if the queue is empty, otherwise False.
        """
        return len(self._items) == 0

    def __repr__(self) -> str:
        """Return a string representation of the Queue object with any items.

        It is ordered in ascending order of order in which items were queued.
        
        Returns:
        --------
        str
            A string in the format 'Queue([item1, item2, ...])', where the list shows
            the current elements in the queue in their order of arrival from enqueue.
        """
        return f"Queue({', '.join(self._items)})"
