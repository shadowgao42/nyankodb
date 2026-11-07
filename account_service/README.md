# 냥코DB 계정 서버 배포본

기존 로컬 계정 서버의 로그인·세션·로그아웃·마이페이지 조회/편집·연동 구현을 재사용한다. `api/index.py`는 같은 출처의 `/api/*` 요청을 이 Flask 앱에 전달하며 `NYANKODB_SITE_ROOT`만 공개 사이트 루트로 지정한다. 기존 아이디와 Supabase Auth UUID의 연결, 실제 Auth 사용자 확인, AES-GCM 계정 암호화, HttpOnly 세션, CSRF 검사를 유지한다.

운영 환경에는 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ACCOUNT_ENCRYPTION_KEY`, `APP_ORIGIN`이 서버 Secret으로 필요하다. 기존 저장 계정을 읽으려면 기존 암호화 키를 그대로 사용한다. 실제 값·개인 설정·시험 계정·원본 세이브는 이 저장소에 포함하지 않는다. 회원가입과 Google 로그인은 기존 준비 중 상태를 유지하며 해당 기능의 환경변수를 켜지 않는다.

`vendor`는 고정 BCSFE-Python 소스(`85fb94cbf00c6a74dbef58932610fb94ec8f7495`)다. 원본 소스를 그대로 포함하며 GPL-3.0-or-later 라이선스는 `vendor/LICENSE`에 있다. `parse_worker.py`는 별도 오프라인 자식 프로세스에서 실행하고 게임 원본 대신 허용된 게임 정보만 반환한다.

스테이지 전체 HTML은 서버 함수 묶음에서 제외한다. `build_stage_rules.py`가 기존 `_stage_rule` 함수를 그대로 실행해 `mypage/account-stage-rules.json`을 만든다. 사이트 카탈로그/스테이지 생성 결과가 바뀌면 아래 명령으로 다시 생성한다.

```powershell
python -B account_service/build_stage_rules.py --site .
```

캐시는 원본 카탈로그 SHA-256이 일치할 때만 사용한다. 로컬에서 캐시가 없거나 오래됐으면 기존 HTML 해석 경로로 돌아가며, 서버 함수는 포함되지 않은 HTML을 추정하지 않는다. 이 변경은 스테이지별 허용 장·성급·숫자/체크 값의 의미를 바꾸지 않는다.
