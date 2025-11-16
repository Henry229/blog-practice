# Codex-Claude Loop 커스터마이징 가이드

## 1. 현재 스킬 분석

### 현재 구조
```
Phase 1: Claude가 계획 수립
Phase 2: Codex가 계획 검증
Phase 3: 피드백 루프 (필요시 재검증)
Phase 4: Claude가 구현
Phase 5: Codex가 코드 리뷰
Phase 6: 반복 개선
```

### 문제점
1. **사용자 입력 과다**: 매 Phase마다 모델/reasoning 레벨 물어봄
2. **비용 비효율**: 항상 고가 모델(gpt-5) 사용
3. **프로젝트 특화 부족**: Next.js/TypeScript/Supabase 특화 검증 없음

---

## 2. 프로젝트 맞춤형 개선안

### 2.1 모델 선택 자동화

```yaml
# 작업 유형별 최적 모델
plan_validation:
  - 빠른 검증: gemini-2.0-flash (저렴, 빠름)
  - 중간 검증: claude-3.5-sonnet (균형)
  - 심층 검증: gpt-5 (최고 품질)

code_review:
  - 일반 리뷰: gemini-2.0-flash
  - 보안 리뷰: gpt-5 + high reasoning
  - 성능 리뷰: claude-3.5-sonnet
```

### 2.2 프로젝트 특화 프롬프트

```bash
# Next.js 16 + Supabase 특화 검증
cat << 'EOF' | codex exec -m gemini-2.0-flash --sandbox read-only
Review this Next.js 16 implementation plan:
[계획 내용]

Check specifically for:
1. Next.js 16 App Router compatibility
   - Server Components usage
   - async cookies() API
   - Server Actions best practices

2. Supabase integration
   - Client vs Server client usage
   - RLS policy considerations
   - Auth flow correctness

3. TypeScript type safety
   - Proper type definitions
   - No 'any' types
   - Database schema alignment

4. Security
   - XSS prevention
   - CSRF protection
   - Auth bypass risks
EOF
```

### 2.3 비용 최적화 전략

| 작업 유형 | 모델 | 예상 비용/회 | 사용 시기 |
|-----------|------|--------------|-----------|
| 계획 초안 검증 | gemini-2.0-flash | ~$0.01 | 초기 드래프트 |
| 코드 리뷰 (일반) | gemini-2.0-flash | ~$0.01 | 일반적인 변경 |
| 보안 검토 | gpt-5 + medium | ~$0.30 | 인증/권한 관련 |
| 아키텍처 검토 | gpt-5 + high | ~$0.50 | 주요 설계 결정 |

**월간 예상 비용** (하루 10회 분석):
- Gemini만 사용: $3/월
- 혼합 사용: $20/월
- GPT-5만 사용: $150/월

---

## 3. 커스텀 검증 템플릿

### 3.1 Phase 0 검증 (Common Foundation)

```bash
#!/bin/bash
# File: scripts/codex-validate-phase0.sh

cat << 'EOF' > /tmp/phase0_validation.txt
Review Phase 0 implementation for Next.js blog:

Files to check:
- types/*.ts (User, Blog, Comment types)
- lib/data/mockBlogs.ts (Mock data structure)
- lib/utils/*.ts (date, text, validation utilities)
- components/ui/* (shadcn components)

Validation checklist:
1. TypeScript types match Supabase schema
2. Mock CRUD functions handle edge cases
3. Utility functions have proper error handling
4. shadcn components are properly configured
5. No type safety issues (no 'any' types)

Project context:
- Next.js 16 App Router
- Tailwind CSS v4 (CSS-first config)
- Supabase for production
- Mock data for development
EOF

cat /tmp/phase0_validation.txt | codex exec \
  -m gemini-2.0-flash \
  --sandbox read-only \
  --config model_reasoning_effort="low"
```

### 3.2 보안 특화 검증

```bash
#!/bin/bash
# File: scripts/codex-security-review.sh

cat << 'EOF' > /tmp/security_review.txt
Security review for authentication implementation:

Focus areas:
1. XSS prevention
   - User-generated content sanitization
   - Proper React escaping
   - No dangerouslySetInnerHTML

2. Authentication
   - Supabase Auth integration
   - Session management
   - Cookie security (httpOnly, secure, sameSite)

3. Authorization
   - Protected routes implementation
   - Server-side validation
   - Client-side security checks

4. Data validation
   - Form input validation
   - SQL injection prevention (Supabase client)
   - Type coercion vulnerabilities

Report any HIGH or CRITICAL security issues found.
EOF

cat /tmp/security_review.txt | codex exec \
  -m gpt-5 \
  --config model_reasoning_effort="high" \
  --sandbox read-only
```

### 3.3 성능 검증

```bash
#!/bin/bash
# File: scripts/codex-performance-review.sh

cat << 'EOF' > /tmp/performance_review.txt
Performance review for blog implementation:

Check for:
1. Bundle size optimization
   - Unnecessary imports
   - Large dependencies
   - Code splitting opportunities

2. Rendering performance
   - Proper Server Component usage
   - Client Component minimization
   - Hydration optimization

3. Database queries
   - N+1 query problems
   - Missing indexes
   - Pagination implementation

4. Caching strategy
   - Static generation usage
   - Revalidation settings
   - Client-side caching

Provide specific optimization recommendations.
EOF

cat /tmp/performance_review.txt | codex exec \
  -m claude-3.5-sonnet \
  --config model_reasoning_effort="medium" \
  --sandbox read-only
```

---

## 4. 자동화된 워크플로우

### 4.1 단계별 자동 검증

```bash
#!/bin/bash
# File: scripts/validate-all-phases.sh

phases=(
  "phase-0-common-foundation"
  "phase-1-layout-components"
  "phase-2-root-config"
  "phase-3-auth-pages"
  "phase-4-blog-list-page"
  "phase-5-blog-detail-page"
  "phase-6-blog-write-page"
  "phase-7-blog-edit-page"
)

for phase in "${phases[@]}"; do
  echo "🔍 Validating $phase..."

  cat << EOF | codex exec -m gemini-2.0-flash --sandbox read-only
Review implementation for $phase:

Check:
1. All required files exist
2. TypeScript types are correct
3. Components follow Next.js 16 patterns
4. No security vulnerabilities
5. Proper error handling

Project directory: prompts/$phase/
EOF

  echo "✅ Completed $phase validation"
  echo "---"
done
```

### 4.2 Git Hook 통합

```bash
#!/bin/bash
# File: .git/hooks/pre-commit

# Codex 자동 검증 (변경된 파일만)
changed_files=$(git diff --cached --name-only --diff-filter=ACM)

if [[ $changed_files == *".ts"* ]] || [[ $changed_files == *".tsx"* ]]; then
  echo "🤖 Running Codex review on changed files..."

  cat << EOF | codex exec -m gemini-2.0-flash --sandbox read-only
Quick review of changed files:
$changed_files

Check for:
- Obvious bugs
- Type safety issues
- Security concerns

Keep response brief (under 200 words).
EOF
fi
```

---

## 5. 비용 모니터링

### 5.1 사용량 추적

```bash
#!/bin/bash
# File: scripts/codex-usage-tracker.sh

# Codex 사용 로그
log_file="$HOME/.codex-usage.log"

# 사용 기록
echo "$(date '+%Y-%m-%d %H:%M:%S'),$1,$2" >> "$log_file"

# 월간 사용량 요약
month=$(date '+%Y-%m')
echo "📊 Codex usage for $month:"
grep "^$month" "$log_file" | awk -F, '{
  models[$2]++
  total++
}
END {
  for (model in models) {
    print "  " model ": " models[model] " calls"
  }
  print "  Total: " total " calls"
}'
```

### 5.2 예상 비용 계산

```bash
#!/bin/bash
# File: scripts/estimate-cost.sh

cat << 'SCRIPT'
# 모델별 평균 비용 (17K tokens 기준)
declare -A costs=(
  ["gpt-5"]="0.48"
  ["gpt-4.5-turbo"]="0.15"
  ["claude-3.5-sonnet"]="0.15"
  ["gemini-2.0-flash"]="0.01"
)

# 월간 사용 추정
monthly_validations=30  # 하루 1회 × 30일

echo "💰 Monthly cost estimates:"
for model in "${!costs[@]}"; do
  monthly_cost=$(echo "$monthly_validations * ${costs[$model]}" | bc)
  echo "  $model: \$$monthly_cost/month"
done
SCRIPT
```

---

## 6. 실전 사용 예시

### 예시 1: 계획 검증 (저비용)

```bash
# Gemini로 빠르게 검증
cat .doc/01-plan/03-plan-based-pages.md | codex exec \
  -m gemini-2.0-flash \
  --sandbox read-only \
  --config model_reasoning_effort="low"
```

### 예시 2: 보안 리뷰 (고품질)

```bash
# GPT-5로 심층 보안 검토
cat << EOF | codex exec -m gpt-5 \
  --config model_reasoning_effort="high" \
  --sandbox read-only
Security audit of authentication system:

Files:
- app/actions/auth.ts
- middleware.ts
- components/auth/*

Check for OWASP Top 10 vulnerabilities.
EOF
```

### 예시 3: 코드 리뷰 (균형)

```bash
# Claude로 코드 품질 검토
cat << EOF | codex exec -m claude-3.5-sonnet \
  --sandbox read-only
Review recent changes to blog components:

Focus on:
- Next.js 16 best practices
- React 19 patterns
- Type safety
- Performance
EOF
```

---

## 7. 다음 단계

1. ✅ **스킬 수정**: `.claude/skills/codex-claude-loop/SKILL.md` 업데이트
2. ✅ **스크립트 생성**: `scripts/` 폴더에 자동화 스크립트 추가
3. ✅ **Git Hook 설정**: Pre-commit 검증 활성화
4. ✅ **비용 모니터링**: 사용량 추적 시작

## 8. 추천 설정

**일반 개발**:
- 모델: `gemini-2.0-flash`
- Reasoning: `low`
- 비용: ~$0.01/회

**중요 변경**:
- 모델: `claude-3.5-sonnet`
- Reasoning: `medium`
- 비용: ~$0.15/회

**보안/아키텍처**:
- 모델: `gpt-5`
- Reasoning: `high`
- 비용: ~$0.50/회
