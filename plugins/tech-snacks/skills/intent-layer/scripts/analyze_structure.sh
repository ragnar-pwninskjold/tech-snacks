#!/usr/bin/env bash
# Analyze codebase structure for Intent Layer placement
# Usage: ./analyze_structure.sh [path]

set -e

TARGET_PATH="${1:-.}"

echo "=== Intent Layer Structure Analysis ==="
echo "Target: $TARGET_PATH"
echo ""

echo "## Directory Structure (depth 3)"
find "$TARGET_PATH" -type d -maxdepth 3 \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/.next/*" \
  -not -path "*/build/*" \
  -not -path "*/__pycache__/*" \
  | head -50

echo ""
echo "## Existing Intent Nodes"
find "$TARGET_PATH" -name "AGENTS.md" -o -name "CLAUDE.md" 2>/dev/null | head -20

echo ""
echo "## Large Directories (potential boundaries)"
echo "(Directories with >20 files)"
find "$TARGET_PATH" -type d \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/.next/*" \
  -exec sh -c 'count=$(find "$1" -maxdepth 1 -type f | wc -l); [ $count -gt 20 ] && echo "$count files: $1"' _ {} \; 2>/dev/null \
  | sort -rn | head -15

echo ""
echo "## Package/Config Files (semantic boundaries)"
find "$TARGET_PATH" -maxdepth 4 \
  \( -name "package.json" -o -name "Cargo.toml" -o -name "go.mod" -o -name "pyproject.toml" \) \
  -not -path "*/node_modules/*" 2>/dev/null | head -20

echo ""
echo "## Suggested Intent Node Locations"
echo "1. Root: $TARGET_PATH/AGENTS.md (required)"

# Find src-like directories
for dir in src lib app packages services api; do
  if [ -d "$TARGET_PATH/$dir" ]; then
    echo "2. Source: $TARGET_PATH/$dir/AGENTS.md"
  fi
done

echo ""
echo "Run estimate_tokens.py on specific directories to determine if they need their own node."
