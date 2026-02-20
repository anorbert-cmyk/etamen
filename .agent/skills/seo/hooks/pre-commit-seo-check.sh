#!/usr/bin/env bash
# =============================================================================
# pre-commit-seo-check.sh
# Pre-commit hook for SEO validation on staged HTML files.
#
# Exit codes:
#   0  - All checks passed (or only warnings found)
#   2  - Critical errors found (commit should be blocked)
#
# Usage:
#   As a git pre-commit hook:
#     cp .agent/skills/seo/hooks/pre-commit-seo-check.sh .git/hooks/pre-commit
#     chmod +x .git/hooks/pre-commit
#
#   Manual run on specific files:
#     bash .agent/skills/seo/hooks/pre-commit-seo-check.sh file1.html file2.html
#
#   Manual run on all staged files:
#     bash .agent/skills/seo/hooks/pre-commit-seo-check.sh
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Counters
ERRORS=0
WARNINGS=0
FILES_CHECKED=0

# Collect files to check
if [ $# -gt 0 ]; then
    # Files passed as arguments
    FILES=("$@")
else
    # Get staged HTML/HTM/JSX/TSX files from git
    mapfile -t FILES < <(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | grep -iE '\.(html?|jsx|tsx)$' || true)
fi

if [ ${#FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}SEO Check: No HTML/JSX/TSX files staged. Skipping.${NC}"
    exit 0
fi

echo -e "${BOLD}${CYAN}========================================${NC}"
echo -e "${BOLD}${CYAN}  SEO Pre-Commit Validation${NC}"
echo -e "${BOLD}${CYAN}========================================${NC}"
echo ""

# ---------------------------------------------------------------------------
# Helper: report an error (blocks commit)
# ---------------------------------------------------------------------------
report_error() {
    local file="$1"
    local line_num="$2"
    local message="$3"
    echo -e "  ${RED}ERROR${NC} [line ${line_num}]: ${message}"
    ((ERRORS++))
}

# ---------------------------------------------------------------------------
# Helper: report a warning (does not block commit)
# ---------------------------------------------------------------------------
report_warning() {
    local file="$1"
    local line_num="$2"
    local message="$3"
    echo -e "  ${YELLOW}WARN${NC}  [line ${line_num}]: ${message}"
    ((WARNINGS++))
}

# ---------------------------------------------------------------------------
# Check 1: Placeholder text in schema or meta tags
# Patterns that indicate unfinished schema markup.
# ---------------------------------------------------------------------------
check_placeholder_text() {
    local file="$1"
    local line_num=0

    while IFS= read -r line; do
        ((line_num++))
        # Check for common placeholder patterns in JSON-LD and meta content
        if echo "$line" | grep -qiE '\[Business Name\]|\[Your |INSERT |PLACEHOLDER|TODO:|FIXME:|XXX:|example\.com|yoursite\.com|yoursaas\.com|your-domain'; then
            # Only flag if it looks like it is in a schema block or meta tag
            if echo "$line" | grep -qiE 'schema\.org|application/ld\+json|"name"|"url"|"email"|"telephone"|content='; then
                report_error "$file" "$line_num" "Placeholder text found in schema or meta tag: $(echo "$line" | sed 's/^[[:space:]]*//' | cut -c1-80)"
            fi
        fi
    done < "$file"
}

# ---------------------------------------------------------------------------
# Check 2: Title tag length
# Warning if title is outside 30-60 character range.
# ---------------------------------------------------------------------------
check_title_length() {
    local file="$1"
    local line_num=0

    while IFS= read -r line; do
        ((line_num++))
        if echo "$line" | grep -qiE '<title[^>]*>'; then
            # Extract title content (handles single-line titles)
            local title_text
            title_text=$(echo "$line" | sed -n 's/.*<title[^>]*>\(.*\)<\/title>.*/\1/Ip')
            if [ -n "$title_text" ]; then
                local title_len=${#title_text}
                if [ "$title_len" -lt 30 ]; then
                    report_warning "$file" "$line_num" "Title tag too short (${title_len} chars, recommended 30-60): \"${title_text}\""
                elif [ "$title_len" -gt 60 ]; then
                    report_warning "$file" "$line_num" "Title tag too long (${title_len} chars, recommended 30-60): \"${title_text:0:60}...\""
                fi
            fi
        fi
    done < "$file"
}

# ---------------------------------------------------------------------------
# Check 3: Images without alt text
# Warning for <img> tags missing alt attribute.
# ---------------------------------------------------------------------------
check_image_alt() {
    local file="$1"
    local line_num=0

    while IFS= read -r line; do
        ((line_num++))
        # Check for img tags (HTML)
        if echo "$line" | grep -qiE '<img[^>]*>'; then
            if ! echo "$line" | grep -qiE '<img[^>]*alt='; then
                report_warning "$file" "$line_num" "Image tag missing alt attribute"
            elif echo "$line" | grep -qiE 'alt=""' || echo "$line" | grep -qiE "alt=''"; then
                report_warning "$file" "$line_num" "Image tag has empty alt attribute (use descriptive text unless decorative)"
            fi
        fi
    done < "$file"
}

# ---------------------------------------------------------------------------
# Check 4: Deprecated schema types
# Error for schema types Google no longer supports or has restricted.
# ---------------------------------------------------------------------------
check_deprecated_schema() {
    local file="$1"
    local line_num=0

    while IFS= read -r line; do
        ((line_num++))
        # HowTo schema: Google removed HowTo rich results in September 2023
        if echo "$line" | grep -qE '"@type"\s*:\s*"HowTo"'; then
            report_error "$file" "$line_num" "Deprecated schema type: HowTo (Google removed HowTo rich results in Sep 2023)"
        fi
        # SpecialAnnouncement: COVID-era schema, no longer supported
        if echo "$line" | grep -qE '"@type"\s*:\s*"SpecialAnnouncement"'; then
            report_error "$file" "$line_num" "Deprecated schema type: SpecialAnnouncement (no longer supported)"
        fi
        # FAQPage: Google restricted FAQPage to government and health sites (Aug 2023)
        if echo "$line" | grep -qE '"@type"\s*:\s*"FAQPage"'; then
            report_warning "$file" "$line_num" "FAQPage schema: Google restricted to government/health sites (Aug 2023). Verify eligibility."
        fi
    done < "$file"
}

# ---------------------------------------------------------------------------
# Check 5: FID references (should be INP)
# FID (First Input Delay) was replaced by INP (Interaction to Next Paint) in
# March 2024 as a Core Web Vital.
# ---------------------------------------------------------------------------
check_fid_references() {
    local file="$1"
    local line_num=0

    while IFS= read -r line; do
        ((line_num++))
        if echo "$line" | grep -qiE 'First Input Delay|FID[^a-zA-Z]|\bFID\b'; then
            # Avoid false positives on words containing FID
            if echo "$line" | grep -qiE 'First Input Delay|\bFID\b'; then
                report_warning "$file" "$line_num" "Reference to FID (First Input Delay) found. FID was replaced by INP (Interaction to Next Paint) as a Core Web Vital in March 2024."
            fi
        fi
    done < "$file"
}

# ---------------------------------------------------------------------------
# Check 6: Meta description length
# Warning if meta description is outside 120-160 character range.
# ---------------------------------------------------------------------------
check_meta_description_length() {
    local file="$1"
    local line_num=0

    while IFS= read -r line; do
        ((line_num++))
        if echo "$line" | grep -qiE '<meta[^>]*name=["\x27]description["\x27]'; then
            local desc_text
            desc_text=$(echo "$line" | sed -n 's/.*content=["\x27]\([^"\x27]*\)["\x27].*/\1/Ip')
            if [ -n "$desc_text" ]; then
                local desc_len=${#desc_text}
                if [ "$desc_len" -lt 120 ]; then
                    report_warning "$file" "$line_num" "Meta description too short (${desc_len} chars, recommended 120-160)"
                elif [ "$desc_len" -gt 160 ]; then
                    report_warning "$file" "$line_num" "Meta description too long (${desc_len} chars, recommended 120-160): \"${desc_text:0:80}...\""
                fi
            fi
        fi
    done < "$file"
}

# ---------------------------------------------------------------------------
# Check 7: Multiple H1 tags
# Warning if file contains more than one H1 tag.
# ---------------------------------------------------------------------------
check_multiple_h1() {
    local file="$1"
    local h1_count
    h1_count=$(grep -ciE '<h1[\s>]' "$file" 2>/dev/null || echo "0")
    if [ "$h1_count" -gt 1 ]; then
        report_warning "$file" "0" "Multiple H1 tags found (${h1_count}). Each page should have exactly one H1."
    elif [ "$h1_count" -eq 0 ]; then
        # Only warn for full HTML pages (not partials/components)
        if grep -qiE '<html|<!DOCTYPE' "$file" 2>/dev/null; then
            report_warning "$file" "0" "No H1 tag found. Every page should have exactly one H1."
        fi
    fi
}

# ---------------------------------------------------------------------------
# Check 8: Missing canonical tag
# Warning for HTML pages without a canonical link.
# ---------------------------------------------------------------------------
check_canonical() {
    local file="$1"
    # Only check full HTML pages
    if grep -qiE '<html|<!DOCTYPE' "$file" 2>/dev/null; then
        if ! grep -qiE '<link[^>]*rel=["\x27]canonical["\x27]' "$file" 2>/dev/null; then
            report_warning "$file" "0" "No canonical tag found. Every indexable page should have a self-referencing canonical."
        fi
    fi
}

# ---------------------------------------------------------------------------
# Run all checks on each file
# ---------------------------------------------------------------------------
for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        continue
    fi

    ((FILES_CHECKED++))
    echo -e "${BOLD}Checking: ${file}${NC}"

    check_placeholder_text "$file"
    check_title_length "$file"
    check_image_alt "$file"
    check_deprecated_schema "$file"
    check_fid_references "$file"
    check_meta_description_length "$file"
    check_multiple_h1 "$file"
    check_canonical "$file"

    echo ""
done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo -e "${BOLD}${CYAN}========================================${NC}"
echo -e "${BOLD}${CYAN}  SEO Check Summary${NC}"
echo -e "${BOLD}${CYAN}========================================${NC}"
echo -e "  Files checked: ${FILES_CHECKED}"
echo -e "  Errors:        ${RED}${ERRORS}${NC}"
echo -e "  Warnings:      ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ "$ERRORS" -gt 0 ]; then
    echo -e "${RED}${BOLD}COMMIT BLOCKED: ${ERRORS} error(s) found.${NC}"
    echo -e "${RED}Fix all errors before committing. Warnings are informational.${NC}"
    echo ""
    exit 2
elif [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}${BOLD}COMMIT ALLOWED with ${WARNINGS} warning(s).${NC}"
    echo -e "${YELLOW}Consider addressing warnings for optimal SEO.${NC}"
    echo ""
    exit 0
else
    echo -e "${GREEN}${BOLD}ALL CHECKS PASSED. No issues found.${NC}"
    echo ""
    exit 0
fi
