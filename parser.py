import argparse
import json
import logging
import math
import re
import sys

# Configure logging to output to stderr so stdout is perfectly clean for the JSON
logging.basicConfig(level=logging.INFO, format="%(message)s", stream=sys.stderr)

def is_prime(n):
    """
    Efficient prime check using 6k ± 1 optimization.
    """
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def parse_line(line):
    """
    Extract id, destination, weight from a line.
    Returns a dictionary or None if malformed.
    """
    line = line.strip()
    if not line:
        return None
    
    # Extract values regardless of varying spacing/separators
    id_match = re.search(r"ID:\s*([^,]+)(?:,|$)", line, re.IGNORECASE)
    dest_match = re.search(r"DESTINATION:\s*([^,]+)(?:,|$)", line, re.IGNORECASE)
    weight_match = re.search(r"WEIGHT_IN_KG:\s*([^\s,]+)", line, re.IGNORECASE)
    
    if not id_match or not dest_match or not weight_match:
        return None
        
    try:
        weight = float(weight_match.group(1).strip())
    except ValueError:
        return None
        
    return {
        "id": id_match.group(1).strip(),
        "destination": dest_match.group(1).strip(),
        "weight": weight
    }

def apply_rules(record):
    """
    Apply business rules to a record.
    Rule 1: 1.45x multiplier if DESTINATION contains EXACT substring "Sector-7"
    Rule 2: Round to nearest whole number
    Rule 3: Discard if final weight is prime
    Returns updated record or None if discarded.
    """
    original_id = record['id']
    weight = record['weight']
    
    # Rule 1: Sector-7 Multiplier
    if "Sector-7" in record['destination']:
        weight *= 1.45
        
    # Rule 2: Round to nearest whole number
    # using standard rounding (.5 rounds to nearest even in Python 3, which is fine, 
    # but for typical .5 rounds up we can use math.floor(weight + 0.5), although standard round is generally accepted)
    # Let's stick strictly to Python's round() which is standard for "round to the nearest whole number"
    rounded_weight = round(weight)
    
    # Rule 3: Filter Primes
    if is_prime(rounded_weight):
        logging.info(f"[REMOVED] Prime weight: ID {original_id}")
        return None
        
    record['weight'] = rounded_weight
    return record

def main():
    parser = argparse.ArgumentParser(description="Parse cargo manifest file.")
    parser.add_argument("manifest_file", help="Path to the manifest.txt file")
    
    args = parser.parse_args()
    
    valid_records = []
    
    try:
        with open(args.manifest_file, "r", encoding="utf-8") as f:
            for line_no, line in enumerate(f, 1):
                clean_line = line.strip()
                if not clean_line:
                    continue
                    
                record = parse_line(clean_line)
                if not record:
                    logging.info(f"[SKIPPED] Malformed row: {clean_line}")
                    continue
                    
                processed_record = apply_rules(record)
                if processed_record:
                    valid_records.append(processed_record)
                    
    except FileNotFoundError:
        logging.error(f"Error: File '{args.manifest_file}' not found.")
        sys.exit(1)
    except Exception as e:
        logging.error(f"Error reading file: {e}")
        sys.exit(1)
        
    # Output only valid JSON to stdout
    print(json.dumps(valid_records, indent=2))

if __name__ == "__main__":
    main()
