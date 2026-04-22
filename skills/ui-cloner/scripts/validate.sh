#!/bin/bash

# Validate skill structure and format
# Usage: ./validate.sh

set -e

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_MD="${SKILL_DIR}/SKILL.md"

echo "Validating skill: $(basename "$SKILL_DIR")"

# Check if SKILL.md exists
if [ ! -f "$SKILL_MD" ]; then
  echo "❌ Error: SKILL.md not found"
  exit 1
fi

# Extract name from frontmatter
NAME=$(grep -A 1 "^---$" "$SKILL_MD" | grep "name:" | sed 's/name: //' | tr -d '\r')

# Validate name format
if ! echo "$NAME" | grep -qE '^[a-z0-9]+(-[a-z0-9]+)*$'; then
  echo "❌ Error: Invalid name format. Must match ^[a-z0-9]+(-[a-z0-9]+)*$"
  exit 1
fi

# Check if directory name matches skill name
DIR_NAME=$(basename "$SKILL_DIR")
if [ "$NAME" != "$DIR_NAME" ]; then
  echo "❌ Error: Directory name ($DIR_NAME) doesn't match skill name ($NAME)"
  exit 1
fi

# Extract description
DESCRIPTION=$(grep "description:" "$SKILL_MD" | sed 's/description: //' | tr -d '\r')

# Validate description length
DESC_LEN=${#DESCRIPTION}
if [ "$DESC_LEN" -lt 1 ] || [ "$DESC_LEN" -gt 1024 ]; then
  echo "❌ Error: Description must be 1-1024 characters (got $DESC_LEN)"
  exit 1
fi

echo "✅ Skill validation passed"
echo "   Name: $NAME"
echo "   Description: $DESCRIPTION"
