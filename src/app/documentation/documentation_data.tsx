export interface GeneralDocumentationItem {
  type: "description" | "code"; // To differentiate between description and code
  content: React.ReactNode | string; // Could be a React component or a string (for code)
}

export interface GeneralDocumentationSection {
  title: string;
  id: string;
  items: GeneralDocumentationItem[]; // Array of optional descriptions and code blocks
}

export const generalDocumentationSections: GeneralDocumentationSection[] = [
  {
    title: "Introduction",
    id: "introduction",
    items: [
      {
        type: "description",
        content: (
          <>
            <p className="mb-6">
              This platform is a web-based application designed to help users
              strengthen their algorithmic thinking skills by practicing
              pseudocode aligned with the standards of International
              Baccalaureate (IB) Computer Science. Specifically, it caters to IB
              Pseudocode as outlined in two key documents that provide guidance
              to its usage in examinations:
            </p>

            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="/documents/Pseudocode%20in%20Examinations%202014.pdf"
                  target="_blank"
                >
                  Pseudocode in Examinations (2014)
                </a>
              </li>
              <li>
                <a
                  href="/documents/Approved%20notation%20for%20developing%20pseudocode.pdf"
                  target="_blank"
                >
                  Approved Notation for Developing Pseudocode
                </a>
              </li>
            </ul>

            <p className="mb-6">
              Users should refer to these two IB documents for a comprehensive
              understanding of the pseudocode rules and conventions. The purpose
              of this platform's documentation is not to provide a full guide to
              all features but rather to clarify specific aspects, offer
              additional context, and explain the main exceptions and extensions
              to IB pseudocode supported on this platform.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              Alignment with IB Standards
            </h2>
            <p className="mb-6">
              The pseudocode language employed by this application closely
              mirrors the IB-approved notations. However, due to the way
              pseudocode is converted and executed in Python, some
              Python-specific syntax and features not defined in IB pseudocode
              may still work. Users should note that most errors are Python
              runtime or syntax errors during compilation. That said, the
              platform also implements custom errors to enforce IB
              pseudocode-style conventions, such as:
            </p>

            <ul>
              <li>
                Syntax errors when <strong>end</strong> blocks are not used.
              </li>
              <li>Errors when variables are not capitalized.</li>
              <li>
                Errors when <strong>then</strong> is not used after{" "}
                <strong>if</strong> or <strong>else if</strong> statements.
              </li>
              <li>
                Custom runtime errors for extended IB pseudocode types/classes,
                such as arrays, collections, queues, and stacks.
              </li>
            </ul>

            <h2 className="mb-4">Exceptions and Extensions</h2>
            <p className="mb-6">
              While adhering to IB standards as much as possible, this platform
              introduces certain exceptions and extensions to make it better
              suited for dynamic, challenge-oriented programming tasks. These
              modifications address the practical needs of solving problems
              where input and data structures are more flexible and dynamic than
              in typical IB examination scenarios.
            </p>

            <h3>Key Extensions:</h3>
            <ul>
              <li>
                <strong>Dynamic Data Inputs:</strong> Unlike IB exams where data
                types like arrays or strings have obvious lengths, this platform
                requires support for dynamic lengths. Therefore, the{" "}
                <code>length</code> property has been added to several
                datatypes, although this isn't provided directly by IB.
              </li>
              <li>
                <strong>Enhanced String and Array Operations:</strong> Many
                challenges require solutions that depend on operations such as
                determining the length of strings or arrays, which are not often
                always emphasized in IB pseudocode as the length is infered by
                the predefined parameters of the question inputs. Therefore,
                functions like <code>set_length</code> are provided to handle
                this.
              </li>
            </ul>

            <h3>Notable Exceptions:</h3>
            <ul>
              <li>
                <strong>Equality Operator:</strong> In IB pseudocode, the
                equality operator is represented by <code>=</code>. However, to
                avoid confusion with assignment statements, this platform uses{" "}
                <code>==</code> as the equality operator.
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    title: "Comments",
    id: "comments",
    items: [
      {
        type: "description",
        content: (
          <p>
            Comments can be on new-lines or at the end of lines. Both comments
            in the form of <code>#</code> or <code>#</code> are supported by
            this platform. Although, <code>#</code> is prefered by IB in
            pseudocode, the code editor on this platform provides better
            formatting when <code>#</code> is used. Therefore, this platform
            recommends the usage of <code>#</code> python-like symbols for
            comments.
          </p>
        ),
      },
      {
        type: "code",
        content: `COUNTER = 0 # Initialize Variable
loop while COUNTER <= 10
    output COUNTER
end loop

# This code outputs from 0 to 10 on new lines.`,
      },
    ],
  },
  {
    title: "Variables",
    id: "variable",
    items: [
      {
        type: "description",
        content: (
          <p>
            Variables names must be in uppercase and only support uppercase
            characters A-Z and undescores. Characters like digits, special
            characters, and dashes are not supported. Additionally, none of the
            keywords or predefined variables, functions, or classes used in IB
            Pseudocode or Python <em>(i.e., loop, while, and, or )</em> should
            be used as keywords. This could result in a syntax error.
          </p>
        ),
      },
      {
        type: "code",
        content: `MY_ARRAY = Array() # This is a valid variable name and assignment`,
      },
    ],
  },
  {
    title: "Input / Output",
    id: "input-output",
    items: [
      {
        type: "description",
        content: (
          <p>
            To get user input, use the <code>input</code> keyword followed by a
            variable name as specified in <a href="#variable">variables</a>.
            This feature is provided by this platform with a dialogue box for
            input in both <em>playground mode</em> and{" "}
            <em>pseudocode challenges</em>. However, its usage will never be
            required in response to a <em>pseudocode challenge</em>, and it will
            not be applicable.
            <br />
            <br />
            Although <code>input</code> is not frequently used in IB
            examinations, when it is, the input value is not always assumed to
            be a string. On this platform, however, input is always treated as a
            string. To convert strings to other data types, you can use standard
            Python methods such as <code>int()</code>, <code>float()</code>, or{" "}
            <code>bool()</code>.
            <br />
            <br />
            Additionally, when trying to get user input — especially in{" "}
            <em>playground mode</em> — you cannot directly specify a prompt
            string in this platform. A recommended workaround is to use{" "}
            <code>output</code> beforehand to display a prompt for the user.
          </p>
        ),
      },
      {
        type: "code",
        content: `# Display a prompt for the user
output "Enter your name:"

# Receive user input
input name

# Output a greeting
output "Hello, " + name`,
      },
      {
        type: "code",
        content: `# Display a prompt for the user
output "Enter your age:"

# Receive user input (as a string)
input age

# Convert the input to an integer
age = int(age)

# Output the age next year
output "Next year, you will be " + (age + 1)`,
      },
      {
        type: "code",
        content: `# Use output to display a custom prompt
output "Enter a number to double:"

# Get the input as a string
input number

# Convert to integer and perform calculation
number = int(number)
output "Double of your number is: " + (number * 2)`,
      },
    ],
  },
  {
    title: "Data Type Conversion",
    id: "data-type-conversion",
    items: [
      {
        type: "description",
        content: (
          <p>
            To convert a datatype to other data types, you can use standard
            Python methods such as <code>int()</code>, <code>float()</code>, or{" "}
            <code>bool()</code>. Refer to the official Python 3.13.1 documentation.
          </p>
        ),
      },
      {
        type: "code",
        content: `NUMBER = 0
# Convert to a boolean
IS_FASLE = bool(number)
output IS_FASLE  # Output: False

# Another example where boolean is true
number = 1
IS_FIS_TRUEALSE = bool(number)
output IS_TRUE  # Output: True`,
      },
    ],
  },
  {
    title: "Conditionals",
    id: "conditionals",
    items: [],
  },
  {
    title: "Loops",
    id: "loops",
    items: [],
  },
];

export const dataTypes = [
  {
    id: "string",
    name: "String",
    description: (
      <>
        <p>
          A string defined with <code>""</code> obtains all Python methods and
          properties of a Python string class. In order to practice for IB
          examinations, it is recommended not to use any of the features.
          <br />
          <br />
          Most strings in the <em>pseudocode-problems</em> are defined with the
          class <code>CustomString</code>. It is a subclass of the standard
          Python string but adds a <code>length</code> attribute as a public
          property. The purpose for this is to maintain consistency with other
          datatypes with the use of the <code>length</code> property.
        </p>
      </>
    ),
    constructorExample: `MY_STRING = "abc" # Standard Python string
PREFERRED_STRING = CustomString("abc") # Subclass of Python string with additional length property`,
    methods: [
      {
        name: "str methods",
        description:
          "All the methods of Python strings. Refer to the official Python 3.13.1 documentation. This is not recommended to use in pseudocode-challenges.",
      }
    ],
    attributes: [
      { name: "length", description: "The amount of characters of the string (read-only)." },
    ],
    errors: [
      {
        name: "",
        description:
          "All the errors associated with Python strings. Refer to the official Python 3.13.1 documentation",
      }
    ],
  },

  {
    id: "array",
    name: "Array",
    description: (
      <p>
        An <strong>Array</strong> is an indexed, ordered set of elements. Its
        size is fixed after initialization.
      </p>
    ),
    constructorDescription: (
      <>
        <p className="text-lg leading-relaxed">
          Arrays must be initialized immediately upon creation. During
          initialization, the array acquires a fixed size and can optionally be
          populated with values. To initialize an array, you must use one of the
          following methods:
        </p>
        <ul>
          <li>
            Include values directly in the construction, e.g.,{" "}
            <code>ARRAY = Array(3, 5, 1, 2)</code>.
          </li>
        </ul>
        <p className="text-lg leading-relaxed">
          It is important to note that only one of these initialization methods
          can be applied to a single array
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
