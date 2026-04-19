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
1. **Rule 1 (Titan Handling):** If the destination string contains the EXACT substring "Titan", the weight is multiplied by `1.45`.
2. **Rule 2 (Rounding):** After applying Rule 1 (if applicable), the final weight is mathematically rounded to the nearest whole number.
3. **Rule 3 (Prime Weight Filtering):** If the rounded weight is a **prime number**, the record is considered prohibited and is completely discarded from the final output.

## Example Input / Output

**Input (`manifest.txt`) excerpt:**
```
ID: 101, DESTINATION: International Space Station, WEIGHT_IN_KG: 18
ID: 102, DESTINATION: Titan, WEIGHT_IN_KG: 100
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
    "destination": "International Space Station",
    "weight": 18
  },
  {
    "id": "102",
    "destination": "Titan",
    "weight": 145
  }
]
```

## Error Handling

- **Malformed Rows:** Any row missing an ID, DESTINATION, or numeric WEIGHT_IN_KG is safely caught and skipped. A log entry `[SKIPPED] Malformed row: <line>` is generated.
- **Empty Lines:** Empty lines and inconsistent spacing / padding are gracefully handled.
- **File Errors:** If the specified file cannot be read or is not found, the script emits a clear error and exits safely (status 1) without crashing.

---

## Intergalactic Cargo API

A local REST API server built with Flask to expose parsed cargo data.

### Installation

To install the required dependencies (Flask):
```bash
pip install flask
```

### Data Generation

Before running the API, ensure you have generated `output.json` from the latest manifest:
```bash
python parser.py manifest.txt > output.json
```

### Running the API

Start the server locally:
```bash
python app.py
```
The server will run on `http://localhost:5000`.

### Endpoints

#### GET /api/cargo
Returns a JSON array of all valid cargo records loaded from `output.json`.

**Example Request:**
```bash
curl http://localhost:5000/api/cargo
```

### Special Override Behavior (CRITICAL)

If a request contains the following header:
`X-System-Override: true`

The API will deny access and return a **418 I'm a teapot** status code.

**Override Request:**
```bash
curl -i -H "X-System-Override: true" http://localhost:5000/api/cargo
```

**Response:**
```
HTTP/1.1 418 I'M A TEAPOT
System override denied.
```
