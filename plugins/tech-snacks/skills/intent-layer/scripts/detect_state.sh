#!/usr/bin/env bash
# Detect Intent Layer state in a project
# Usage: ./detect_state.sh [path]
# Returns: "none" | "partial" | "complete"

set -e

TARGET_PATH="${1:-.}"

ROOT_FILE=""
HAS_INTENT_SECTION=false
CHILD_NODES=()

# Find root context file
if [ -f "$TARGET_PATH/CLAUDE.md" ]; then
    ROOT_FILE="CLAUDE.md"
elif [ -f "$TARGET_PATH/AGENTS.md" ]; then
    ROOT_FILE="AGENTS.md"
fi

# Check for Intent Layer section
if [ -n "$ROOT_FILE" ]; then
    if grep -q "## Intent Layer" "$TARGET_PATH/$ROOT_FILE" 2>/dev/null; then
        HAS_INTENT_SECTION=true
    fi
fi

# Find child AGENTS.md files
while IFS= read -r file; do
    CHILD_NODES+=("$file")
done < <(find "$TARGET_PATH" -name "AGENTS.md" -not -path "$TARGET_PATH/AGENTS.md" -not -path "*/node_modules/*" 2>/dev/null)

# Output state
echo "=== Intent Layer State ==="
echo "root_file: ${ROOT_FILE:-none}"
echo "has_intent_section: $HAS_INTENT_SECTION"
echo "child_nodes: ${#CHILD_NODES[@]}"

for node in "${CHILD_NODES[@]}"; do
    echo "  - $node"
done

echo ""
if [ -z "$ROOT_FILE" ]; then
    echo "state: none"
    echo "action: initial setup required"
elif [ "$HAS_INTENT_SECTION" = false ]; then
    echo "state: partial"
    echo "action: add Intent Layer section to $ROOT_FILE"
else
    echo "state: complete"
    echo "action: maintenance mode (audit/candidates/both)"
fi
