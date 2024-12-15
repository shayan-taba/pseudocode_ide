interface DocumentationItem {
  type: "description" | "code"; // To differentiate between description and code
  content: React.ReactNode | string; // Could be a React component or a string (for code)
}

interface DocumentationSection {
  title: string;
  items: DocumentationItem[]; // Array of optional descriptions and code blocks
}

export const generalDocumentationSections: DocumentationSection[] = [
  {
    title: "Introduction",
    items: [
      {
        type: "description",
        content: (
          <p className="text-lg leading-relaxed">
            This documentation provides an overview of usage of this adapted
            version of IB Pseudocode. Please refer to the following official IB
            documents for documentation and usage{" "}
            <a
              target="_blank"
              href="/documents/Pseudocode in Examinations 2014.pdf"
              className="text-blue-300 hover:text-blue-500 underline"
            >
              Pseudocode in Examinations
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              href="/documents/Approved notation for developing pseudocode.pdf"
              className="text-blue-300 hover:text-blue-500 underline"
            >
              Approved notation for developing pseudocode
            </a>
            .
            <br />
            <br />
            Pseudocode in IB examinations provides some degree of flexibility in
            its usage and syntax with certain conditions, such as{" "}
            <em>&quot;clear algorithmic thinking&quot;</em> and{" "}
            <em>&quot;logic in the candidate&apos;s response&quot;</em>. However, the
            pseudocode langauuge used by this application relies on the approved
            notations with some extensions and exceptions. These exceptions and
            extensions to the usage of standard IB Pseudocode will be explained
            on this page.
          </p>
        ),
      },
    ],
  },
  {
    title: "Comments",
    items: [
      {
        type: "description",
        content: (
          <p className="text-lg leading-relaxed">
            Comments must only be on new-lines. In-line comments are not
            supported yet. Comments begin with the symbol <code>#</code>.
          </p>
        ),
      },
      {
        type: "code",
        content: `COUNTER = 0
loop while COUNTER <= 10
    output COUNTER
end loop

# This code outputs from 0 to 10 on new lines.`,
      },
    ],
  },
  {
    title: "Input / Output",
    items: [
      {
        type: "description",
        content: (
          <p className="text-lg leading-relaxed">
            To get user input, use the <code>input</code> keyword followed by a
            variable name. Variables must follow the standard convention of
            being upper-case and not repeating a IB Pseudocode or Python
            keyword. All input is assumed to be a string in this application.
            This may not be the case in IB examinations. To convert strings to
            other datatypes, follow the standard python version. The example
            below converts an input to an integer.
          </p>
        ),
      },
      {
        type: "code",
        content: `output "Please enter your age"
input AGE
CURRENT_YEAR = 2024
output "you were born in", CURRENT_YEAR - int(AGE), "or" , CURRENT_YEAR - int(AGE) - 1`,
      },
    ],
  },
  {
    title: "Length",
    items: [],
  },
  {
    title: "Data Types",
    items: [
      {
        type: "description",
        content: (
          <p className="text-lg leading-relaxed">
            All datatypes &#40;i.e., booleans, arrays, string, collections, etc.&#41;, as seen in the two IB pseudocode guide documents, are available and generally work exactly as specified in the documents. Noteworthy exceptions to this rule of thumb apply to the <em>array</em> datatypes and these are explained in the <a href="#array">array</a>.
            All datatypes with custom IB methods &#40;i.e., arrays, collections, queues, stacks&#40; have detailed documentation on this page.
          </p>
        ),
      },
      {
        type: "code",
        content: `output "Please enter your age"
input AGE
CURRENT_YEAR = 2024
output "you were born in", CURRENT_YEAR - int(AGE), "or" , CURRENT_YEAR - int(AGE) - 1`,
      },
    ],
  },
];

export const dataTypes = [
  {
    id: "array",
    name: "Array",
    description: (
      <>
        <p>
          An <strong>Array</strong> is an indexed, ordered set of elements. Its
          size is fixed after initialization.
        </p>
        <pre className="bg-slate-800 p-4 rounded mb-4">
          <code>
            {`MY_ARRAY = Array()
MY_ARRAY.set_length(5)
MY_ARRAY[0] = "Hello"
MY_ARRAY[1] = 42`}
          </code>
        </pre>
      </>
    ),
    constructorDescription: (
      <>
        <p>
          Arrays must be initialized. On initialization, they array obtains a
          fixed size and are optionally filled with values. To Initialize it,
          only use one of the following: (1) include values in the construction,
          (2) use <code>set_length</code> directly after construction, (3) or
          use <code>intialize values</code> directly after construction.
        </p>
      </>
    ),
    constructorExample: `MY_ARRAY = Array()
MY_ARRAY.set_length(5)
MY_ARRAY[0] = "Hello"
MY_ARRAY[1] = 42
output MY_ARRAY # Array(["Hello",42,None,None,None])

ANOTHER_ARRAY = Array(1,2,3)
ANOTHER_ARRAY[0] = 4
ANOTHER_ARRAY[1] = 2
output ANOTHER_ARRAY # Array([4,2,3])`,
    methods: [
      {
        name: "set_length(length: number)",
        description:
          "Sets the array's size. Raises an error if size is not a positive integer.",
      },
      {
        name: "initialize_values(...values)",
        description: "Initializes the array with given values.",
      },
    ],
    attributes: [
      { name: "length", description: "The size of the array (read-only)." },
    ],
    errors: [
      {
        name: "ValueError",
        description:
          "Raised when invalid size or initialization method is used.",
      },
      {
        name: "IndexError",
        description: "Raised when accessing an out-of-bounds index.",
      },
      {
        name: "TypeError",
        description:
          "Raise when a value is added that is not one of the following: int, float, str, bool, list, dict, None",
      },
    ],
  },
  {
    id: "collection",
    name: "Collection",
    description:
      "A Collection stores an ordered set of elements and provides mechanisms for iteration.",
    constructorExample: `MY_COLLECTION =  Collection();
MY_COLLECTION.addItem(42)
MY_COLLECTION.addItem("example")`,
    methods: [
      {
        name: "addItem(item)",
        description: "Adds an item to the collection.",
      },
      {
        name: "getNext()",
        description: "Retrieves the next item in the collection.",
      },
      {
        name: "resetNext()",
        description: "Resets the iteration pointer to the beginning.",
      },
      {
        name: "hasNext()",
        description: "Checks if there are more items to iterate over.",
      },
      {
        name: "isEmpty()",
        description: "Checks if the collection is empty.",
      },
    ],
    attributes: [
      {
        name: "length",
        description: "The number of items in the collection (read-only).",
      },
    ],
    errors: [
      {
        name: "ValueError",
        description: "Raised when adding multiple items at once.",
      },
      {
        name: "Exception",
        description: "Raised if iteration methods are used without resetting.",
      },
    ],
  },
  {
    id: "queue",
    name: "Queue",
    description: (
      <>
        <p>
          A <strong>Queue</strong> is a First-In-First-Out (FIFO) collection,
          where items are enqueued at the back and dequeued from the front.
        </p>
        <pre className="bg-slate-800 p-4 rounded mb-4">
          <code>
            {`MY_QUEUE = Queue('1','3')
MY_QUEUE.enqueue('2')
MY_QUEUE.dequeue('4)
output MY_QUEUE # Queue(['1','3','2','4'])`}
          </code>
        </pre>
      </>
    ),
    constructorDescription: (
      <>
        <p>
          Queues are initialized and optionally populated with items. Example:
        </p>
      </>
    ),
    constructorExample: `MY_QUEUE = Queue("1","4")`,
    methods: [
      {
        name: "enqueue(ITEM)",
        description: "Adds an item to the end of the queue.",
      },
      {
        name: "dequeue()",
        description: "Removes the first item from the queue.",
      },
      { name: "isEmpty()", description: "Checks if the queue is empty." },
    ],
    attributes: [
      { name: "length", description: "The number of items in the queue." },
    ],
    errors: [
      {
        name: "ValueError",
        description:
          "Raised when invalid arguments are passed to enqueue or dequeue methods.",
      },
      {
        name: "IndexError",
        description: "Raised when attempting to dequeue from an empty queue.",
      },
    ],
  },
  {
    id: "stack",
    name: "Stack",
    description: (
      <>
        <p>
          A <strong>Stack</strong> is a Last-In-First-Out (LIFO) collection,
          where items are pushed to the top and popped from the top.
        </p>
        <pre className="bg-slate-800 p-4 rounded mb-4">
          <code>
            {`MY_STACK = Stack('1')
MY_STACK.push('2')
MY_STACK.pop()`}
          </code>
        </pre>
      </>
    ),
    constructorDescription: (
      <>
        <p>
          Stacks are initialized and optionally populated with items. Example:
        </p>
      </>
    ),
    constructorExample: `MY_STACK = STACK('1')`,
    methods: [
      {
        name: "push(ITEM)",
        description: "Adds an item to the top of the stack.",
      },
      {
        name: "pop()",
        description: "Removes and returns the top item of the stack.",
      },
      { name: "isEmpty()", description: "Checks if the stack is empty." },
    ],
    attributes: [
      { name: "length", description: "The number of items in the stack." },
    ],
    errors: [
      {
        name: "ValueError",
        description:
          "Raised when invalid arguments are passed to the push method.",
      },
      {
        name: "IndexError",
        description: "Raised when attempting to pop from an empty stack.",
      },
    ],
  },
];
