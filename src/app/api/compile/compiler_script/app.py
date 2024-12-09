import sys
from syntax_runtime_check import syntax_check_and_run_converted
from pseudo_conversions_utils.conversion_compiler import pseudocode_to_python

def main():
    if len(sys.argv) < 2:
        print("Error: Pseudocode argument missing.")
        sys.exit(1)

    # Get pseudocode from command-line argument
    pseudocode = sys.argv[1]

    # Convert pseudocode to Python
    try:
        python_code = pseudocode_to_python(pseudocode)
        if not python_code:
            print("Error: Failed to convert pseudocode to Python.")
            sys.exit(1)
        #if python_code:
            #print(python_code)
    except Exception as e:
        print(f"Error during conversion: {e}")
        sys.exit(1)

    # Run the converted Python code
    try:
        print("Executing converted Python code...\n")
        print(syntax_check_and_run_converted(python_code))
    except Exception as e:
        print(f"Runtime error: {e}")

if __name__ == "__main__":
    main()
