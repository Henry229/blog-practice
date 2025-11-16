#!/bin/bash
# Codex Phase Validation Script
# Usage: ./scripts/codex-validate-phase.sh <phase-number> [model]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
PHASE=$1
MODEL=${2:-gemini-2.0-flash}  # Default to cheap model
REASONING=${3:-low}

if [ -z "$PHASE" ]; then
  echo -e "${RED}❌ Error: Phase number required${NC}"
  echo "Usage: $0 <phase-number> [model] [reasoning]"
  echo ""
  echo "Examples:"
  echo "  $0 0                              # Validate Phase 0 with gemini-2.0-flash"
  echo "  $0 3 claude-3.5-sonnet medium     # Validate Phase 3 with Claude"
  echo "  $0 2 gpt-5 high                   # Validate Phase 2 with GPT-5"
  exit 1
fi

# Phase directory mapping
case $PHASE in
  0)
    PHASE_DIR="prompts/phase-0-common-foundation"
    PHASE_NAME="Phase 0: Common Foundation"
    ;;
  1)
    PHASE_DIR="prompts/phase-1-layout-components"
    PHASE_NAME="Phase 1: Layout Components"
    ;;
  2)
    PHASE_DIR="prompts/phase-2-root-config"
    PHASE_NAME="Phase 2: Root Configuration"
    ;;
  3)
    PHASE_DIR="prompts/phase-3-auth-pages"
    PHASE_NAME="Phase 3: Authentication Pages"
    ;;
  4)
    PHASE_DIR="prompts/phase-4-blog-list-page"
    PHASE_NAME="Phase 4: Blog List Page"
    ;;
  5)
    PHASE_DIR="prompts/phase-5-blog-detail-page"
    PHASE_NAME="Phase 5: Blog Detail Page"
    ;;
  6)
    PHASE_DIR="prompts/phase-6-blog-write-page"
    PHASE_NAME="Phase 6: Blog Write Page"
    ;;
  7)
    PHASE_DIR="prompts/phase-7-blog-edit-page"
    PHASE_NAME="Phase 7: Blog Edit Page"
    ;;
  *)
    echo -e "${RED}❌ Invalid phase number: $PHASE${NC}"
    exit 1
    ;;
esac

# Check if phase directory exists
if [ ! -d "$PHASE_DIR" ]; then
  echo -e "${RED}❌ Phase directory not found: $PHASE_DIR${NC}"
  exit 1
fi

echo -e "${BLUE}🔍 Validating $PHASE_NAME${NC}"
echo -e "${BLUE}📁 Directory: $PHASE_DIR${NC}"
echo -e "${BLUE}🤖 Model: $MODEL${NC}"
echo -e "${BLUE}🧠 Reasoning: $REASONING${NC}"
echo ""

# Create validation prompt
cat << EOF > /tmp/phase_${PHASE}_validation.txt
Review implementation plans for $PHASE_NAME:

Directory: $PHASE_DIR

Files in this phase:
$(ls -1 $PHASE_DIR/*.md 2>/dev/null || echo "No markdown files found")

Project Context:
- Framework: Next.js 16 (App Router)
- TypeScript: Strict mode
- Styling: Tailwind CSS v4 (CSS-first)
- UI: shadcn/ui (Radix UI)
- Database: Supabase
- Auth: Supabase Auth

Validation Checklist:
1. Next.js 16 App Router compatibility
   - Proper Server/Client Component usage
   - async cookies() API usage
   - Server Actions best practices

2. TypeScript type safety
   - No 'any' types
   - Proper interface definitions
   - Type guards where needed

3. Supabase integration
   - Correct client usage (client vs server)
   - Proper error handling
   - RLS considerations

4. Security concerns
   - XSS prevention
   - CSRF protection
   - Auth bypass risks
   - Input validation

5. Performance
   - Unnecessary re-renders
   - Bundle size concerns
   - Database query optimization

6. Error handling
   - Edge cases covered
   - Proper error messages
   - Fallback states

Be specific about file paths and line numbers when identifying issues.
EOF

# Run Codex validation
echo -e "${YELLOW}⏳ Running Codex validation...${NC}"
echo ""

cat /tmp/phase_${PHASE}_validation.txt | codex exec \
  -m "$MODEL" \
  --config model_reasoning_effort="$REASONING" \
  --sandbox read-only

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ Validation completed successfully${NC}"
else
  echo -e "${RED}❌ Validation failed with exit code: $EXIT_CODE${NC}"
fi

# Cleanup
rm -f /tmp/phase_${PHASE}_validation.txt

exit $EXIT_CODE
