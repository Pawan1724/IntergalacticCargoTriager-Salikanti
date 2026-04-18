# IntergalacticCargoTriager - Salikanti

A production-ready CLI tool to parse legacy cargo manifest files and applying strict intergalactic cargo regulations.

## How to run the script

Prerequisites:
- Python 3.6 or higher.

To run the parser against a given manifest text file, simply provide the path to the text file as an argument:
```bash
python parser.py manifest.txt
```

## Business Rules

The parser strictly applies the following business rules:
1. **Rule 1 (Sector-7 Handling):** If the destination string contains the EXACT substring "Sector-7", the weight is multiplied by `1.45`.
2. **Rule 2 (Rounding):** After applying Rule 1 (if applicable), the final weight is mathematically rounded to the nearest whole number.
3. **Rule 3 (Prime Weight Filtering):** If the rounded weight is a **prime number**, the record is considered prohibited and is completely discarded from the final output.

## Example Input / Output

**Input (`manifest.txt`) excerpt:**
```
ID: 101, DESTINATION: Sector-9, WEIGHT_IN_KG: 18
ID: 102, DESTINATION: Sector-7, WEIGHT_IN_KG: 100
ID: 103, DESTINATION: Earth, WEIGHT_IN_KG: 7
```

**Console logs (stderr):**
```
[REMOVED] Prime weight: ID 103
```

**Output JSON (stdout):**
```json
[
  {
    "id": "101",
    "destination": "Sector-9",
    "weight": 18
  },
  {
    "id": "102",
    "destination": "Sector-7",
    "weight": 145
  }
]
```

## Error Handling

- **Malformed Rows:** Any row missing an ID, DESTINATION, or numeric WEIGHT_IN_KG is safely caught and skipped. A log entry `[SKIPPED] Malformed row: <line>` is generated.
- **Empty Lines:** Empty lines and inconsistent spacing / padding are gracefully handled.
- **File Errors:** If the specified file cannot be read or is not found, the script emits a clear error and exits safely (status 1) without crashing.
