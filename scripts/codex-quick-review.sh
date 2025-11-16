#!/bin/bash
# Quick Codex code review for changed files
# Usage: ./scripts/codex-quick-review.sh [files...]

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get changed files
if [ $# -eq 0 ]; then
  # No arguments: use git to find changed files
  CHANGED_FILES=$(git diff --name-only --diff-filter=ACM HEAD 2>/dev/null || echo "")

  if [ -z "$CHANGED_FILES" ]; then
    # No git changes, check staged files
    CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || echo "")
  fi

  if [ -z "$CHANGED_FILES" ]; then
    echo -e "${YELLOW}⚠️  No changed files found${NC}"
    exit 0
  fi
else
  # Use provided files
  CHANGED_FILES="$@"
fi

# Filter TypeScript/TSX files only
TS_FILES=$(echo "$CHANGED_FILES" | grep -E '\.(ts|tsx)$' || echo "")

if [ -z "$TS_FILES" ]; then
  echo -e "${YELLOW}⚠️  No TypeScript files to review${NC}"
  exit 0
fi

echo -e "${BLUE}🔍 Quick Codex review of changed files${NC}"
echo ""
echo -e "${BLUE}Files to review:${NC}"
echo "$TS_FILES" | while read file; do
  echo "  - $file"
done
echo ""

# Create review prompt
cat << EOF | codex exec -m gemini-2.0-flash --sandbox read-only
Quick code review of these changed files:

$(echo "$TS_FILES" | while read file; do
  if [ -f "$file" ]; then
    echo "### $file"
    cat "$file"
    echo ""
  fi
done)

Focus on:
1. Obvious bugs or logic errors
2. Type safety issues
3. Security vulnerabilities (XSS, injection, auth bypass)
4. Next.js 16 best practices violations
5. Performance red flags

Keep response concise (under 300 words). Only report significant issues.
EOF

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ Review completed${NC}"
else
  echo -e "${YELLOW}⚠️  Review completed with warnings${NC}"
fi

exit 0
