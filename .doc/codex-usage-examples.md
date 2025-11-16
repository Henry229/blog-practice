# Codex 사용 예시 및 실전 가이드

## 📚 목차
1. [기본 사용법](#1-기본-사용법)
2. [프로젝트 자동화 스크립트](#2-프로젝트-자동화-스크립트)
3. [비용 최적화 전략](#3-비용-최적화-전략)
4. [실전 워크플로우](#4-실전-워크플로우)

---

## 1. 기본 사용법

### 1.1 간단한 코드 리뷰

```bash
# 변경된 파일 자동 검토 (Gemini - 저렴)
./scripts/codex-quick-review.sh

# 특정 파일 검토
./scripts/codex-quick-review.sh app/page.tsx components/auth/LoginForm.tsx
```

**비용**: ~$0.01/회

---

### 1.2 Phase별 계획 검증

```bash
# Phase 0 검증 (Gemini - 빠르고 저렴)
./scripts/codex-validate-phase.sh 0

# Phase 3 검증 (Claude - 균형잡힌 품질)
./scripts/codex-validate-phase.sh 3 claude-3.5-sonnet medium

# Phase 2 검증 (GPT-5 - 최고 품질, 보안 중요)
./scripts/codex-validate-phase.sh 2 gpt-5 high
```

**비용**:
- Gemini: ~$0.01/회
- Claude: ~$0.15/회
- GPT-5: ~$0.50/회

---

### 1.3 수동 Codex 호출

```bash
# 간단한 질문 (Gemini)
echo "Does this auth flow have any security issues?" | \
  codex exec -m gemini-2.0-flash --sandbox read-only

# 심층 분석 (GPT-5)
cat .doc/01-plan/03-plan-based-pages.md | \
  codex exec -m gpt-5 \
    --config model_reasoning_effort="high" \
    --sandbox read-only
```

---

## 2. 프로젝트 자동화 스크립트

### 2.1 Phase 검증 스크립트 사용법

#### **기본 사용**
```bash
# Phase 0 검증 (기본: Gemini)
./scripts/codex-validate-phase.sh 0

# 출력 예시:
# 🔍 Validating Phase 0: Common Foundation
# 📁 Directory: prompts/phase-0-common-foundation
# 🤖 Model: gemini-2.0-flash
# 🧠 Reasoning: low
#
# ⏳ Running Codex validation...
# [Codex 분석 결과]
# ✅ Validation completed successfully
```

#### **모델 선택**
```bash
# 일반 검증: Gemini (빠름, 저렴)
./scripts/codex-validate-phase.sh 1

# 중요 검증: Claude (균형)
./scripts/codex-validate-phase.sh 3 claude-3.5-sonnet medium

# 보안/아키텍처: GPT-5 (최고 품질)
./scripts/codex-validate-phase.sh 2 gpt-5 high
```

---

### 2.2 빠른 코드 리뷰 스크립트

#### **Git 변경사항 자동 감지**
```bash
# 현재 변경된 TypeScript 파일 리뷰
./scripts/codex-quick-review.sh

# Staged 파일 리뷰
git add .
./scripts/codex-quick-review.sh
```

#### **특정 파일 리뷰**
```bash
# 단일 파일
./scripts/codex-quick-review.sh app/actions/auth.ts

# 여러 파일
./scripts/codex-quick-review.sh \
  app/actions/auth.ts \
  middleware.ts \
  components/auth/LoginForm.tsx
```

---

## 3. 비용 최적화 전략

### 3.1 모델 선택 가이드

| 작업 유형 | 추천 모델 | 비용/회 | 사용 시기 |
|-----------|-----------|---------|-----------|
| 일반 리뷰 | gemini-2.0-flash | $0.01 | 일상적인 코드 변경 |
| 계획 검증 | gemini-2.0-flash | $0.01 | 초기 드래프트 |
| 품질 검토 | claude-3.5-sonnet | $0.15 | 중요한 기능 |
| 보안 감사 | gpt-5 (medium) | $0.30 | 인증/권한 코드 |
| 아키텍처 | gpt-5 (high) | $0.50 | 설계 결정 |

### 3.2 비용 계산 예시

#### **월간 개발 시나리오**

**저비용 전략** (Gemini 중심):
```
- 일일 코드 리뷰: 5회 × $0.01 = $0.05/day
- 주간 Phase 검증: 2회 × $0.01 = $0.02
- 월간 보안 리뷰: 1회 × $0.30 = $0.30
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
월 총 비용: ~$2/month
```

**균형 전략** (Gemini + Claude):
```
- 일일 코드 리뷰: 5회 × $0.01 = $0.05/day
- 주간 Phase 검증: 2회 × $0.15 = $0.30/week
- 월간 보안 리뷰: 2회 × $0.30 = $0.60
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
월 총 비용: ~$5/month
```

**고품질 전략** (모든 모델 활용):
```
- 일일 코드 리뷰: 5회 × $0.01 = $0.05/day
- 주간 Phase 검증: 2회 × $0.15 = $0.30/week
- 주간 심층 리뷰: 1회 × $0.50 = $0.50/week
- 월간 보안 감사: 2회 × $0.50 = $1.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
월 총 비용: ~$10/month
```

---

## 4. 실전 워크플로우

### 4.1 새로운 Phase 시작 시

```bash
# Step 1: 계획 초안 검증 (빠르게)
./scripts/codex-validate-phase.sh 4

# Step 2: 계획 수정 후 재검증
./scripts/codex-validate-phase.sh 4 claude-3.5-sonnet medium

# Step 3: 구현 시작
# ... 코드 작성 ...

# Step 4: 변경사항 리뷰
./scripts/codex-quick-review.sh

# Step 5: 최종 검증
./scripts/codex-validate-phase.sh 4 gpt-5 high
```

---

### 4.2 보안 중요 코드 작성 시

```bash
# Step 1: 계획 보안 검토 (GPT-5)
cat prompts/phase-3-auth-pages/*.md | codex exec \
  -m gpt-5 \
  --config model_reasoning_effort="high" \
  --sandbox read-only

# Step 2: 구현
# ... 인증 코드 작성 ...

# Step 3: 보안 리뷰 (GPT-5)
cat << 'EOF' | codex exec -m gpt-5 \
  --config model_reasoning_effort="high" \
  --sandbox read-only
Security audit of authentication implementation:

Files:
- app/actions/auth.ts
- middleware.ts
- components/auth/*

Check OWASP Top 10:
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Auth Failures
8. Integrity Failures
9. Security Logging Failures
10. SSRF

Report any HIGH or CRITICAL issues.
EOF
```

---

### 4.3 성능 최적화 시

```bash
# Step 1: 성능 프로파일링 (Claude)
cat << 'EOF' | codex exec -m claude-3.5-sonnet \
  --config model_reasoning_effort="medium" \
  --sandbox read-only
Performance analysis of blog implementation:

Check:
1. Bundle size (target: <500KB)
2. Server Component usage
3. Database query efficiency
4. Hydration optimization
5. Image optimization

Provide specific recommendations with file paths.
EOF

# Step 2: 최적화 적용
# ... 코드 수정 ...

# Step 3: 재검증
./scripts/codex-quick-review.sh
```

---

### 4.4 Git Commit 전 자동 검증

#### **Manual Hook 설정**
```bash
# .git/hooks/pre-commit 생성
cat << 'EOF' > .git/hooks/pre-commit
#!/bin/bash
echo "🤖 Running Codex pre-commit review..."

# Changed TypeScript files
changed_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$')

if [ -n "$changed_files" ]; then
  ./scripts/codex-quick-review.sh $changed_files

  if [ $? -ne 0 ]; then
    echo "⚠️  Codex found issues. Review and commit anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
      echo "❌ Commit aborted"
      exit 1
    fi
  fi
fi

exit 0
EOF

chmod +x .git/hooks/pre-commit
```

---

### 4.5 CI/CD 통합

```yaml
# .github/workflows/codex-review.yml
name: Codex Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  codex-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Codex
        run: npm install -g codex-cli

      - name: Codex Review
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
        run: |
          ./scripts/codex-quick-review.sh
```

---

## 5. 고급 사용법

### 5.1 비교 분석

```bash
# 두 파일 비교 분석
cat << EOF | codex exec -m claude-3.5-sonnet --sandbox read-only
Compare these two implementations and recommend the better approach:

## Implementation A (Mock Data)
$(cat prompts/phase-0-common-foundation/03-mock-data.md)

## Implementation B (Supabase)
$(cat app/actions/auth.ts)

Which approach is better for this project? Why?
EOF
```

---

### 5.2 아키텍처 결정 검증

```bash
# 설계 결정 검토
cat << EOF | codex exec -m gpt-5 \
  --config model_reasoning_effort="high" \
  --sandbox read-only
Architecture decision review:

Decision: Use Server Actions instead of API Routes for mutations

Context:
- Next.js 16 App Router
- Supabase Auth
- TypeScript strict mode

Current implementation:
$(cat app/actions/auth.ts)

Questions:
1. Is this the right architectural choice?
2. What are the trade-offs?
3. Are there better alternatives?
4. What are the security implications?
EOF
```

---

### 5.3 레거시 코드 마이그레이션 검증

```bash
# 마이그레이션 계획 검증
cat << EOF | codex exec -m claude-3.5-sonnet \
  --config model_reasoning_effort="medium" \
  --sandbox read-only
Migration plan review:

From: Mock data approach
To: Supabase integration

Current mock implementation:
- lib/data/mockBlogs.ts
- lib/data/mockComments.ts

Target Supabase schema:
- blogs table
- comments table
- profiles table

Review the migration strategy:
1. Is the migration path clear?
2. Are there data loss risks?
3. What testing is needed?
4. What's the rollback plan?
EOF
```

---

## 6. 트러블슈팅

### 6.1 Codex 실행 오류

```bash
# OpenRouter API 키 확인
echo $OPENROUTER_API_KEY

# Codex 버전 확인
codex --version

# 권한 확인
ls -la scripts/codex-*.sh
```

---

### 6.2 비용 폭증 방지

```bash
# 1. 항상 저렴한 모델로 시작
./scripts/codex-validate-phase.sh 0  # Gemini 기본

# 2. 필요시에만 고가 모델 사용
./scripts/codex-validate-phase.sh 2 gpt-5 high  # 보안 검토만

# 3. Reasoning 레벨 최소화
#    - low: 일반 검증
#    - medium: 중요 검증
#    - high: 보안/아키텍처만
```

---

## 7. 추천 워크플로우 요약

### **일반 개발** (저비용)
```bash
# 매일
./scripts/codex-quick-review.sh  # ~$0.05/day

# 주 1회
./scripts/codex-validate-phase.sh <phase>  # ~$0.01
```
**월 비용**: ~$2

---

### **중요 프로젝트** (균형)
```bash
# 매일
./scripts/codex-quick-review.sh  # ~$0.05/day

# 주 2회
./scripts/codex-validate-phase.sh <phase> claude-3.5-sonnet medium  # ~$0.30/week

# 월 1회 보안 감사
# GPT-5 security review  # ~$0.30
```
**월 비용**: ~$5

---

### **프로덕션 준비** (고품질)
```bash
# 매일
./scripts/codex-quick-review.sh  # ~$0.05/day

# 주 2회
./scripts/codex-validate-phase.sh <phase> claude-3.5-sonnet medium  # ~$0.30/week

# 주 1회 심층 리뷰
./scripts/codex-validate-phase.sh <phase> gpt-5 high  # ~$0.50/week

# 월 2회 보안 감사
# GPT-5 security review  # ~$1.00
```
**월 비용**: ~$10

---

## 8. 다음 단계

1. ✅ **스크립트 테스트**: 각 스크립트 실행해보기
2. ✅ **모델 비교**: Gemini vs Claude vs GPT-5 품질 비교
3. ✅ **워크플로우 선택**: 프로젝트에 맞는 전략 선택
4. ✅ **비용 모니터링**: 월간 사용량 추적

---

## 참고 링크

- **Codex CLI**: https://github.com/anthropics/codex-cli
- **OpenRouter**: https://openrouter.ai/
- **가격 정보**: https://openrouter.ai/models
- **스킬 문서**: [SKILL.md](.claude/skills/codex-claude-loop/SKILL.md)
