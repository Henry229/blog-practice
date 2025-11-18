# Codex 사용법 완벽 가이드 - 요약본

## 🎯 핵심 요약

**Codex**는 Claude Code에서 다른 AI 모델(GPT-5, Claude, Gemini 등)을 CLI로 호출해 코드 검증/리뷰를 수행하는 도구입니다.

---

## 📋 1. Codex 작동 원리

### 기본 구조
```
프롬프트 작성 → Codex CLI 실행 → OpenRouter API → AI 모델 → 프로젝트 분석 → 결과 출력
```

### 실제 명령어
```bash
# 기본 패턴
cat 프롬프트파일.txt | codex exec -m <모델명> --sandbox read-only

# 제가 사용한 예시
cat /tmp/plan_review.txt | codex exec \
  -m gpt-5 \
  --config model_reasoning_effort="medium" \
  --sandbox read-only
```

### Sandbox 모드
- `--sandbox read-only`: 읽기만 (계획 검증용) ✅ 안전
- `--sandbox`: 읽기+쓰기 (코드 수정 가능)
- `--no-sandbox`: 제한 없음 ⚠️ 위험

---

## 💰 2. 비용 구조

### 모델별 가격 (17K tokens 분석 기준)

| 모델 | 비용/회 | 특징 | 추천 용도 |
|------|---------|------|-----------|
| **gemini-2.0-flash** | ~$0.01 | 매우 저렴, 빠름 | 일상 검증 ⭐ |
| **claude-3.5-sonnet** | ~$0.15 | 균형잡힌 품질 | 중요 검증 |
| **gpt-5** | ~$0.50 | 최고 품질 | 보안/아키텍처 |

### 월간 비용 예상

**저비용 전략** (Gemini 중심):
- 일일 코드 리뷰 5회 = $0.05/day
- **월 총 비용: ~$2/month** ✅

**균형 전략** (Gemini + Claude):
- 일일 리뷰 + 주간 검증
- **월 총 비용: ~$5/month**

**고품질 전략** (모든 모델):
- 일일 리뷰 + 주간 검증 + 보안 감사
- **월 총 비용: ~$10/month**

---

## 🚀 3. 프로젝트 자동화 스크립트

### 3.1 Phase 검증 스크립트

```bash
# 기본 사용 (Gemini - 저렴)
./scripts/codex-validate-phase.sh 0

# 중요 검증 (Claude - 균형)
./scripts/codex-validate-phase.sh 3 claude-3.5-sonnet medium

# 보안 검증 (GPT-5 - 최고 품질)
./scripts/codex-validate-phase.sh 2 gpt-5 high
```

**기능**:
- Phase 0-7 자동 검증
- Next.js 16, Supabase, TypeScript 특화
- 보안, 성능, 타입 안전성 체크

---

### 3.2 빠른 코드 리뷰 스크립트

```bash
# 변경된 파일 자동 검토
./scripts/codex-quick-review.sh

# 특정 파일 검토
./scripts/codex-quick-review.sh app/actions/auth.ts
```

**기능**:
- Git 변경 파일 자동 감지
- TypeScript/TSX만 필터링
- 버그, 보안, 타입 문제 체크
- 300단어 이내 간결한 리포트

---

## 🎯 4. 실전 사용 시나리오

### 시나리오 1: 새 Phase 시작

```bash
# 1. 계획 초안 빠른 검증 (Gemini)
./scripts/codex-validate-phase.sh 4

# 2. 수정 후 품질 검증 (Claude)
./scripts/codex-validate-phase.sh 4 claude-3.5-sonnet medium

# 3. 구현
# ... 코드 작성 ...

# 4. 코드 리뷰
./scripts/codex-quick-review.sh

# 5. 최종 검증 (선택적)
./scripts/codex-validate-phase.sh 4 gpt-5 high
```

**비용**: $0.01 + $0.15 + $0.01 = **~$0.17**

---

### 시나리오 2: 보안 중요 코드 (인증 시스템)

```bash
# 1. 계획 보안 검토 (GPT-5)
cat prompts/phase-3-auth-pages/*.md | codex exec \
  -m gpt-5 \
  --config model_reasoning_effort="high" \
  --sandbox read-only

# 2. 구현
# ... 인증 코드 작성 ...

# 3. OWASP Top 10 보안 감사 (GPT-5)
cat << 'EOF' | codex exec -m gpt-5 \
  --config model_reasoning_effort="high" \
  --sandbox read-only
Security audit of authentication:
- app/actions/auth.ts
- proxy.ts
- components/auth/*

Check OWASP Top 10 vulnerabilities.
EOF
```

**비용**: $0.50 + $0.50 = **~$1.00** (보안 투자 필수)

---

### 시나리오 3: 일상 개발 (저비용)

```bash
# 매일 아침: 어제 변경사항 리뷰
./scripts/codex-quick-review.sh

# 주 1회: Phase 진행 상황 검증
./scripts/codex-validate-phase.sh <current-phase>
```

**월 비용**: ~$2

---

## 📊 5. 모델 선택 가이드

### 언제 어떤 모델을 쓸까?

#### **Gemini 2.0 Flash** ($0.01/회)
```bash
✅ 일상적인 코드 리뷰
✅ 계획 초안 검증
✅ 빠른 피드백이 필요할 때
✅ 개발 초기 단계

# 사용 예시
./scripts/codex-quick-review.sh
./scripts/codex-validate-phase.sh 0
```

#### **Claude 3.5 Sonnet** ($0.15/회)
```bash
✅ 중요한 기능 구현 검증
✅ 아키텍처 검토
✅ 성능 최적화 분석
✅ 코드 품질 심층 리뷰

# 사용 예시
./scripts/codex-validate-phase.sh 3 claude-3.5-sonnet medium
```

#### **GPT-5** ($0.50/회)
```bash
✅ 보안 감사 (OWASP Top 10)
✅ 프로덕션 배포 전 최종 검증
✅ 복잡한 아키텍처 결정
✅ 규정 준수 검토

# 사용 예시
./scripts/codex-validate-phase.sh 2 gpt-5 high
```

---

## 🔧 6. codex-claude-loop 스킬 커스터마이징

### 현재 스킬의 문제점
1. ❌ 매번 모델 선택 물어봄 (귀찮음)
2. ❌ 항상 고가 모델 사용 (비용 낭비)
3. ❌ 프로젝트 특화 검증 부족

### 개선 방안
1. ✅ 작업 유형별 자동 모델 선택
2. ✅ Next.js/Supabase 특화 프롬프트
3. ✅ 비용 최적화 전략 내장

### 수정할 파일
```bash
# 스킬 정의 수정
.claude/skills/codex-claude-loop/SKILL.md

# 프로젝트별 자동화 추가
scripts/codex-validate-phase.sh
scripts/codex-quick-review.sh
```

---

## 📝 7. 실전 체크리스트

### Phase 구현 전
- [ ] Phase 계획 검증 (Gemini)
- [ ] 보안 고려사항 확인 (GPT-5, 인증 관련 시)
- [ ] 타입 정의 검토 (Gemini)

### 구현 중
- [ ] 매일 변경사항 리뷰 (Gemini)
- [ ] 주요 기능 완료 시 품질 검증 (Claude)

### Phase 완료 후
- [ ] 최종 검증 (Claude or GPT-5)
- [ ] 보안 감사 (GPT-5, 중요 Phase만)
- [ ] 성능 체크 (Claude)

---

## 🎓 8. 핵심 명령어 치트시트

```bash
# 1. 빠른 리뷰 (일상)
./scripts/codex-quick-review.sh

# 2. Phase 검증 (저비용)
./scripts/codex-validate-phase.sh <phase>

# 3. Phase 검증 (고품질)
./scripts/codex-validate-phase.sh <phase> claude-3.5-sonnet medium

# 4. 보안 감사
./scripts/codex-validate-phase.sh <phase> gpt-5 high

# 5. 수동 프롬프트 (커스텀)
cat 파일.txt | codex exec -m <모델> --sandbox read-only
```

---

## 💡 9. 비용 절감 팁

### ✅ 해야 할 것
1. **Gemini로 시작**: 대부분의 경우 충분
2. **필요시에만 업그레이드**: 보안/아키텍처만 GPT-5
3. **Reasoning 최소화**: low → medium → high 순
4. **배치 작업**: 여러 파일 한 번에 검토

### ❌ 하지 말아야 할 것
1. 모든 리뷰에 GPT-5 사용
2. 항상 high reasoning 사용
3. 파일별로 따로따로 검토
4. 실행 전 프롬프트 미확인

---

## 📚 10. 관련 문서

자세한 내용은 다음 문서를 참고하세요:

- **[전체 가이드](.doc/codex-customization-guide.md)**: 커스터마이징 완벽 가이드
- **[사용 예시](.doc/codex-usage-examples.md)**: 실전 시나리오 모음
- **[스킬 정의](.claude/skills/codex-claude-loop/SKILL.md)**: codex-claude-loop 스킬

---

## 🚀 시작하기

### 1단계: 스크립트 실행 권한 확인
```bash
chmod +x scripts/codex-*.sh
```

### 2단계: 첫 검증 실행 (저비용)
```bash
./scripts/codex-validate-phase.sh 0
```

### 3단계: 결과 확인 및 모델 선택
- 만족 → Gemini 계속 사용
- 더 상세한 분석 필요 → Claude 시도
- 보안 우려 → GPT-5 사용

---

## 🎯 추천 워크플로우

**저는 이렇게 추천합니다:**

### 일반 개발 (월 $2)
```bash
# 매일
./scripts/codex-quick-review.sh

# 주 1회
./scripts/codex-validate-phase.sh <phase>
```

### 프로덕션 준비 (월 $5-10)
```bash
# 매일
./scripts/codex-quick-review.sh

# 주 2회
./scripts/codex-validate-phase.sh <phase> claude-3.5-sonnet medium

# 월 1회 보안 감사 (인증/결제 관련)
./scripts/codex-validate-phase.sh <phase> gpt-5 high
```

---

**질문이나 문제가 있으면 언제든지 물어보세요!** 🚀
