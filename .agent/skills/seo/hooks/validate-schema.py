#!/usr/bin/env python3
"""
validate-schema.py
Post-edit JSON-LD schema validation script.

Validates JSON-LD structured data blocks after file edits to catch
common errors before they reach production.

Exit codes:
    0  - All checks passed (or only warnings)
    2  - Critical errors found (should block deployment)

Usage:
    # Validate a single file
    python validate-schema.py path/to/file.html

    # Validate multiple files
    python validate-schema.py file1.html file2.html file3.html

    # Validate via stdin (pipe JSON-LD directly)
    echo '{"@context":"https://schema.org","@type":"Article"}' | python validate-schema.py --stdin

    # Validate all HTML files in a directory
    python validate-schema.py --dir ./dist/

Dependencies:
    Python 3.7+ (stdlib only, no external packages required)
"""

import json
import os
import re
import sys
import argparse
from pathlib import Path
from typing import List, Tuple, Optional

# ============================================================================
# Constants
# ============================================================================

VALID_CONTEXTS = [
    "https://schema.org",
    "http://schema.org",
    "https://schema.org/",
    "http://schema.org/",
]

# Schema types that Google has deprecated or restricted
DEPRECATED_TYPES = {
    "HowTo": "Google removed HowTo rich results in September 2023. Remove this schema.",
    "SpecialAnnouncement": "COVID-era schema type. No longer supported by Google.",
}

# Schema types with restrictions
RESTRICTED_TYPES = {
    "FAQPage": (
        "Google restricted FAQPage rich results to government and health authority "
        "sites in August 2023. Unless your site qualifies, this schema will be ignored."
    ),
}

# Placeholder patterns that indicate unfinished schema
PLACEHOLDER_PATTERNS = [
    r"\[Business Name\]",
    r"\[Your .*?\]",
    r"\[INSERT .*?\]",
    r"\[PLACEHOLDER\]",
    r"example\.com",
    r"yoursite\.com",
    r"yoursaas\.com",
    r"your-domain\.com",
    r"your-company",
    r"yourbrand",
    r"TODO:",
    r"FIXME:",
    r"XXX:",
    r"REPLACE_ME",
    r"CHANGEME",
    r"your_api_key",
    r"sk_test_",
    r"pk_test_",
]

PLACEHOLDER_RE = re.compile("|".join(PLACEHOLDER_PATTERNS), re.IGNORECASE)

# ============================================================================
# Output helpers
# ============================================================================

class Colors:
    """ANSI color codes for terminal output."""
    RED = "\033[0;31m"
    YELLOW = "\033[1;33m"
    GREEN = "\033[0;32m"
    CYAN = "\033[0;36m"
    BOLD = "\033[1m"
    NC = "\033[0m"

    @classmethod
    def disable(cls):
        """Disable colors for non-TTY output."""
        cls.RED = ""
        cls.YELLOW = ""
        cls.GREEN = ""
        cls.CYAN = ""
        cls.BOLD = ""
        cls.NC = ""


# Disable colors if not a TTY
if not sys.stdout.isatty():
    Colors.disable()


errors: List[str] = []
warnings: List[str] = []


def report_error(source: str, message: str) -> None:
    """Record a critical error."""
    errors.append(f"{Colors.RED}ERROR{Colors.NC} [{source}]: {message}")


def report_warning(source: str, message: str) -> None:
    """Record a non-critical warning."""
    warnings.append(f"{Colors.YELLOW}WARN{Colors.NC}  [{source}]: {message}")


# ============================================================================
# JSON-LD extraction
# ============================================================================

def extract_jsonld_blocks(html_content: str) -> List[Tuple[str, int]]:
    """
    Extract JSON-LD script blocks from HTML content.

    Returns a list of (json_string, line_number) tuples.
    """
    blocks = []
    # Match <script type="application/ld+json"> ... </script>
    pattern = re.compile(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        re.DOTALL | re.IGNORECASE,
    )

    for match in pattern.finditer(html_content):
        json_str = match.group(1).strip()
        # Calculate approximate line number
        line_num = html_content[: match.start()].count("\n") + 1
        if json_str:
            blocks.append((json_str, line_num))

    return blocks


# ============================================================================
# Validation functions
# ============================================================================

def validate_json_syntax(json_str: str, source: str) -> Optional[object]:
    """
    Validate JSON syntax. Returns parsed object or None on failure.
    """
    try:
        data = json.loads(json_str)
        return data
    except json.JSONDecodeError as e:
        report_error(source, f"Invalid JSON syntax: {e}")
        return None


def validate_context(data: object, source: str) -> None:
    """
    Check that @context is present and points to schema.org.
    """
    if isinstance(data, list):
        for i, item in enumerate(data):
            validate_context(item, f"{source}[{i}]")
        return

    if not isinstance(data, dict):
        return

    context = data.get("@context")
    if context is None:
        report_error(source, "Missing @context property. Must be 'https://schema.org'.")
    elif isinstance(context, str):
        if context not in VALID_CONTEXTS:
            report_error(
                source,
                f"Invalid @context: '{context}'. Must be 'https://schema.org'."
            )
        elif context.startswith("http://"):
            report_warning(
                source,
                "Using 'http://schema.org'. Prefer 'https://schema.org' (HTTPS)."
            )
    elif isinstance(context, list):
        # Some schemas use array context for extensions; just warn
        report_warning(
            source,
            "Array @context detected. Ensure 'https://schema.org' is included."
        )


def validate_type(data: object, source: str) -> None:
    """
    Check that @type is present and not deprecated.
    """
    if isinstance(data, list):
        for i, item in enumerate(data):
            validate_type(item, f"{source}[{i}]")
        return

    if not isinstance(data, dict):
        return

    schema_type = data.get("@type")
    if schema_type is None:
        report_error(source, "Missing @type property. Every schema object must declare its type.")
    elif isinstance(schema_type, str):
        # Check deprecated types
        if schema_type in DEPRECATED_TYPES:
            report_error(source, f"Deprecated @type: '{schema_type}'. {DEPRECATED_TYPES[schema_type]}")
        # Check restricted types
        if schema_type in RESTRICTED_TYPES:
            report_warning(source, f"Restricted @type: '{schema_type}'. {RESTRICTED_TYPES[schema_type]}")
    elif isinstance(schema_type, list):
        for t in schema_type:
            if t in DEPRECATED_TYPES:
                report_error(source, f"Deprecated @type in array: '{t}'. {DEPRECATED_TYPES[t]}")
            if t in RESTRICTED_TYPES:
                report_warning(source, f"Restricted @type in array: '{t}'. {RESTRICTED_TYPES[t]}")

    # Recursively check nested objects
    for key, value in data.items():
        if key.startswith("@"):
            continue
        if isinstance(value, dict):
            validate_type(value, f"{source}.{key}")
        elif isinstance(value, list):
            for i, item in enumerate(value):
                if isinstance(item, dict):
                    validate_type(item, f"{source}.{key}[{i}]")


def validate_placeholder_text(data: object, source: str, path: str = "") -> None:
    """
    Recursively search for placeholder text in schema values.
    """
    if isinstance(data, dict):
        for key, value in data.items():
            current_path = f"{path}.{key}" if path else key
            validate_placeholder_text(value, source, current_path)
    elif isinstance(data, list):
        for i, item in enumerate(data):
            current_path = f"{path}[{i}]"
            validate_placeholder_text(item, source, current_path)
    elif isinstance(data, str):
        match = PLACEHOLDER_RE.search(data)
        if match:
            report_error(
                source,
                f"Placeholder text found at '{path}': \"{match.group()}\" in value \"{data[:80]}\""
            )


def validate_required_fields(data: object, source: str) -> None:
    """
    Check for commonly required fields based on @type.
    """
    if isinstance(data, list):
        for i, item in enumerate(data):
            validate_required_fields(item, f"{source}[{i}]")
        return

    if not isinstance(data, dict):
        return

    schema_type = data.get("@type", "")

    # Article types should have headline, author, datePublished
    if schema_type in ("Article", "NewsArticle", "BlogPosting"):
        if "headline" not in data:
            report_warning(source, f"{schema_type} missing 'headline' property.")
        if "author" not in data:
            report_warning(source, f"{schema_type} missing 'author' property (E-E-A-T signal).")
        if "datePublished" not in data:
            report_warning(source, f"{schema_type} missing 'datePublished' property.")
        if "image" not in data:
            report_warning(source, f"{schema_type} missing 'image' property (required for rich results).")

    # Product should have name, offers
    if schema_type == "Product":
        if "name" not in data:
            report_warning(source, "Product missing 'name' property.")
        if "offers" not in data and "hasVariant" not in data:
            report_warning(source, "Product missing 'offers' property (required for rich results).")
        if "image" not in data:
            report_warning(source, "Product missing 'image' property (required for rich results).")

    # LocalBusiness should have name, address
    local_types = (
        "LocalBusiness", "Plumber", "Electrician", "HVACBusiness",
        "Attorney", "LegalService", "Dentist", "Restaurant",
        "AutoRepair", "Locksmith", "RoofingContractor", "GeneralContractor",
    )
    if schema_type in local_types:
        if "name" not in data:
            report_warning(source, f"{schema_type} missing 'name' property.")
        if "address" not in data:
            report_warning(source, f"{schema_type} missing 'address' property.")
        if "telephone" not in data:
            report_warning(source, f"{schema_type} missing 'telephone' property.")

    # Organization should have name, url
    if schema_type == "Organization":
        if "name" not in data:
            report_warning(source, "Organization missing 'name' property.")
        if "url" not in data:
            report_warning(source, "Organization missing 'url' property.")

    # Person should have name
    if schema_type == "Person":
        if "name" not in data:
            report_warning(source, "Person missing 'name' property.")


def validate_url_fields(data: object, source: str, path: str = "") -> None:
    """
    Check that URL fields contain valid-looking URLs.
    """
    url_fields = {"url", "image", "logo", "sameAs", "mainEntityOfPage", "item"}

    if isinstance(data, dict):
        for key, value in data.items():
            current_path = f"{path}.{key}" if path else key
            if key in url_fields:
                if isinstance(value, str):
                    if value and not value.startswith(("http://", "https://")):
                        report_warning(
                            source,
                            f"URL field '{current_path}' does not start with http:// or https://: \"{value[:60]}\""
                        )
                elif isinstance(value, list):
                    for i, v in enumerate(value):
                        if isinstance(v, str) and v and not v.startswith(("http://", "https://")):
                            report_warning(
                                source,
                                f"URL in '{current_path}[{i}]' does not start with http:// or https://: \"{v[:60]}\""
                            )
            validate_url_fields(value, source, current_path)
    elif isinstance(data, list):
        for i, item in enumerate(data):
            validate_url_fields(item, source, f"{path}[{i}]")


# ============================================================================
# File processing
# ============================================================================

def validate_file(filepath: str) -> None:
    """
    Validate all JSON-LD blocks in a file.
    """
    source = filepath

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except (OSError, IOError) as e:
        report_error(source, f"Could not read file: {e}")
        return

    # Check if file contains JSON directly (not wrapped in HTML)
    stripped = content.strip()
    if stripped.startswith("{") or stripped.startswith("["):
        # Treat entire file as JSON-LD
        blocks = [(content, 1)]
    else:
        # Extract JSON-LD from HTML
        blocks = extract_jsonld_blocks(content)

    if not blocks:
        # Not an error; file simply has no JSON-LD
        return

    for json_str, line_num in blocks:
        block_source = f"{source}:line {line_num}"

        # 1. JSON syntax validation
        data = validate_json_syntax(json_str, block_source)
        if data is None:
            continue  # Cannot proceed with invalid JSON

        # 2. @context check
        validate_context(data, block_source)

        # 3. @type presence and deprecated type detection
        validate_type(data, block_source)

        # 4. Placeholder text detection
        validate_placeholder_text(data, block_source)

        # 5. Required fields by type
        validate_required_fields(data, block_source)

        # 6. URL field validation
        validate_url_fields(data, block_source)


def validate_stdin() -> None:
    """
    Validate JSON-LD from stdin.
    """
    content = sys.stdin.read().strip()
    if not content:
        report_error("stdin", "No input received on stdin.")
        return

    data = validate_json_syntax(content, "stdin")
    if data is None:
        return

    validate_context(data, "stdin")
    validate_type(data, "stdin")
    validate_placeholder_text(data, "stdin")
    validate_required_fields(data, "stdin")
    validate_url_fields(data, "stdin")


def find_html_files(directory: str) -> List[str]:
    """
    Recursively find HTML files in a directory.
    """
    html_files = []
    for ext in ("*.html", "*.htm"):
        html_files.extend(str(p) for p in Path(directory).rglob(ext))
    return sorted(html_files)


# ============================================================================
# Main
# ============================================================================

def main() -> int:
    """
    Main entry point.

    Returns exit code: 0 for pass/warnings, 2 for critical errors.
    """
    parser = argparse.ArgumentParser(
        description="Validate JSON-LD structured data in HTML files.",
        epilog="Exit code 0: pass/warnings only. Exit code 2: critical errors found.",
    )
    parser.add_argument(
        "files",
        nargs="*",
        help="HTML files to validate",
    )
    parser.add_argument(
        "--stdin",
        action="store_true",
        help="Read JSON-LD from stdin instead of files",
    )
    parser.add_argument(
        "--dir",
        type=str,
        help="Directory to recursively scan for HTML files",
    )
    parser.add_argument(
        "--no-color",
        action="store_true",
        help="Disable colored output",
    )

    args = parser.parse_args()

    if args.no_color:
        Colors.disable()

    print(f"{Colors.BOLD}{Colors.CYAN}========================================{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.CYAN}  JSON-LD Schema Validator{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.CYAN}========================================{Colors.NC}")
    print()

    files_checked = 0

    if args.stdin:
        validate_stdin()
        files_checked = 1
    elif args.dir:
        html_files = find_html_files(args.dir)
        if not html_files:
            print(f"{Colors.YELLOW}No HTML files found in '{args.dir}'.{Colors.NC}")
            return 0
        for filepath in html_files:
            print(f"{Colors.BOLD}Checking: {filepath}{Colors.NC}")
            validate_file(filepath)
            files_checked += 1
    elif args.files:
        for filepath in args.files:
            if not os.path.isfile(filepath):
                report_error(filepath, f"File not found: {filepath}")
                continue
            print(f"{Colors.BOLD}Checking: {filepath}{Colors.NC}")
            validate_file(filepath)
            files_checked += 1
    else:
        parser.print_help()
        return 0

    # Print results
    print()
    if errors:
        print(f"{Colors.BOLD}Errors:{Colors.NC}")
        for msg in errors:
            print(f"  {msg}")
        print()

    if warnings:
        print(f"{Colors.BOLD}Warnings:{Colors.NC}")
        for msg in warnings:
            print(f"  {msg}")
        print()

    # Summary
    print(f"{Colors.BOLD}{Colors.CYAN}========================================{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.CYAN}  Validation Summary{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.CYAN}========================================{Colors.NC}")
    print(f"  Files checked: {files_checked}")
    print(f"  Errors:        {Colors.RED}{len(errors)}{Colors.NC}")
    print(f"  Warnings:      {Colors.YELLOW}{len(warnings)}{Colors.NC}")
    print()

    if errors:
        print(f"{Colors.RED}{Colors.BOLD}VALIDATION FAILED: {len(errors)} critical error(s) found.{Colors.NC}")
        print(f"{Colors.RED}Fix all errors before deploying.{Colors.NC}")
        print()
        return 2
    elif warnings:
        print(f"{Colors.YELLOW}{Colors.BOLD}VALIDATION PASSED with {len(warnings)} warning(s).{Colors.NC}")
        print(f"{Colors.YELLOW}Consider addressing warnings for optimal SEO.{Colors.NC}")
        print()
        return 0
    else:
        print(f"{Colors.GREEN}{Colors.BOLD}ALL CHECKS PASSED. No issues found.{Colors.NC}")
        print()
        return 0


if __name__ == "__main__":
    sys.exit(main())
