# 한국판 공식 스테이지 일정 운영

공식 한국판 일정과 연결되는 스테이지에 같은 일정 표시를 제공합니다. 2026-10-17 수집/검사 시 대상은 319개 맵의 목록·하위 페이지 1,445개입니다. 모두 공통 `stage-navigation.js`가 일정 모듈을 연결합니다. 확대 당시 전체 HTML을 다시 쓰지 않았으며, 후속 일관성 수정에서 기존 테스트 맵 S319/PR000의 HTML 8개에만 남아 있던 별도 일정 태그를 제거해 같은 연결로 통일했습니다. 이후 생성되는 페이지도 같은 공통 로더를 사용합니다. 공개 환경은 아래 GitHub Actions와 전용 데이터 브랜치를 사용하고 로컬 환경은 전용 미리보기 서버를 사용합니다.

일정 원본은 PONOS의 `https://nyanko-events.ponosgames.com/battlecatskr_production/sale.tsv`입니다. 뽑기·미션·로그인·패키지 일정은 이 시범 표시의 대상이 아닙니다. 인증과 TSV 필드 배치는 [PackPack 수집 코드](https://github.com/battlecatsultimate/PackPack/blob/main/src/main/java/mandarin/packpack/supporter/event/EventFileGrabber.java), [스테이지 파서](https://github.com/battlecatsultimate/PackPack/blob/main/src/main/java/mandarin/packpack/supporter/event/StageSchedule.java)를 참고했지만, 일정 값은 그 저장소에서 가져오지 않습니다.

## 로컬 실행

작업 폴더에서 다음을 실행합니다. 이 작업에서 만든 전용 익명 수집 인증 파일은 Windows의 `%LOCALAPPDATA%/NyankoDB/stage-schedule-auth.json`에 있습니다. 실제 플레이어의 게임 계정이나 세이브를 사용하지 않습니다.

```powershell
python .\preview_stage_schedule.py
```

`http://127.0.0.1:8766/stage/index.html`에서 원하는 맵이나 하위 페이지를 엽니다. 로컬 서버가 공식 파일을 처음에 한 번, 이후 300초마다 다시 수집합니다. 브라우저는 같은 서버의 JSON을 60초마다 확인하고 남은 시간을 매초 다시 계산합니다. 서버는 로컬 컴퓨터에서만 접근하도록 `127.0.0.1`에 바인딩합니다. HTML/JS/CSS와 일정 JSON은 `no-store`로 제공하고 조건부 요청에도 최신 본문을 반환하며, 이미지 캐시는 유지합니다. 변경 전 공통 스크립트가 이미 브라우저 캐시에 남은 경우 최초 한 번 강력 새로고침으로 확인합니다. 종료는 실행한 터미널에서 Ctrl+C로 합니다. 백그라운드 실행의 PID는 `temp/stage-schedule-research/http.pid`에서 확인합니다.

다른 컴퓨터에서 인증을 새로 마련할 때만 아래 명령을 실행합니다. 이미 있는 인증 파일은 덮어쓰지 않습니다. 인증 파일을 사이트 폴더에 만들면 수집기가 거부합니다.

```powershell
python .\nyankodb-pages\.github\scripts\update_stage_schedule.py --bootstrap-auth --auth-file "$env:LOCALAPPDATA\NyankoDB\stage-schedule-auth.json"
```

한 번만 갱신하려면 다음 명령을 사용합니다.

```powershell
python .\nyankodb-pages\.github\scripts\update_stage_schedule.py --auth-file "$env:LOCALAPPDATA\NyankoDB\stage-schedule-auth.json" --output .\nyankodb-pages\stage-schedule-kr.json
```

## GitHub Actions 운영

아래는 공개 수집 환경의 등록·갱신 절차입니다. 자격 증명은 Actions Secret에만 등록하고 사이트 파일에는 넣지 않습니다.

1. 최초 구현 시 확인한 원격 Pages 원본은 `main`입니다. 실제 공개 반영 시 원본 브랜치와 공통 스크립트 참조를 다시 확인하고 분리한 체크아웃에 `stage-navigation.js`의 일정 부트스트랩 추가 부분, `stage-schedule.js`, `stage-schedule.css`, `.github/stage-schedule-maps.json`, `.github/scripts`의 두 Python 파일, `.github/workflows/update-stage-schedule.yml`, 이 운영 문서를 선택적으로 병합합니다. 원격 HTML에 공통 스크립트가 없는 경우에는 해당 파일 범위를 별도로 확인합니다. 로컬의 다른 기존 공통 스크립트 변경을 무조건 통째로 올리지 않습니다.
2. 전용 인증 JSON을 `PONOS_EVENT_AUTH`라는 저장소 Secret으로 등록합니다. 아래 명령은 파일 내용을 화면에 출력하지 않습니다.

   ```powershell
   Get-Content -Raw -LiteralPath "$env:LOCALAPPDATA\NyankoDB\stage-schedule-auth.json" | gh secret set PONOS_EVENT_AUTH --repo shadowgao42/nyankodb
   ```

3. 워크플로가 기본 브랜치인 `main`에 들어가야 예약 실행됩니다. `Update official KR stage schedule`을 먼저 수동 실행해 인증·수집·쓰기 권한을 확인합니다.
4. 수집 성공 시 `event-schedule-data` 브랜치를 만들고 그 브랜치의 `stage-schedule-kr.json` 한 파일만 GitHub Contents API로 갱신합니다. 브랜치가 없으면 기존 기본 브랜치의 커밋에서 시작하므로 다른 원격 파일을 제거하지 않습니다. 이 브랜치는 Pages 배포 원본을 바꾸지 않습니다. 작은 일정 갱신 커밋이 하루 최대 약 288개 생길 수 있습니다.
5. 공개 페이지는 이 데이터 브랜치의 Raw JSON을 읽습니다. 데이터 수집은 PONOS 직결이고, GitHub는 인증이 제거된 변환 결과를 전달하는 역할입니다. 브라우저에서 PONOS 인증을 수행하거나 자격 증명을 노출하지 않습니다.

GitHub Actions의 5분 예약은 실행 보장이 아닙니다. 큐 지연·예약 중단·권한 문제·PONOS 오류가 발생할 수 있습니다. 일정 파일의 `fetchedAt`이 30분 이상 오래되면 시간 표시 대신 `일정 갱신 지연`을 표시합니다. 파일을 처음부터 읽지 못하면 일정 표시를 숨기고 기존 레벨 줄의 표시 상태를 유지합니다. 기존에 검증한 파일이 있고 아직 30분 이내라면 일시적인 읽기 실패 때 그 파일을 계속 사용합니다. 수동 실행 성공과 장기 예약 실행의 안정성은 구분해서 확인합니다.

인증이 거부되면 전용 익명 인증을 새로 만든 후 Secret을 갱신합니다. 워크플로가 매번 새 계정을 만드는 방식은 사용하지 않습니다. JWT는 각 수집 실행의 메모리에서만 사용하고 JSON·로그에 넣지 않습니다.

## 표시와 해석

- `.github/stage-schedule-maps.json`은 현재 사이트에 존재하는 이벤트 맵 1,226개의 정확한 절대 ID를 담습니다. `stage_data.STAGE_CODE_CONFIG`의 기존 기준값과 맵 번호를 사용하며, 공식 `sale.tsv`의 실제 맵 목록에 연결되고 버전·기간 조건에 맞는 맵만 피드에 넣습니다. 이벤트가 없는 맵은 표시를 숨깁니다.
- 일반 레전드 `N`의 절대 ID 0~999는 sale.tsv의 판매·보너스 코드와 충돌하므로 이벤트 맵으로 연결하지 않습니다. 본편·좀비 습격 계열 및 미션 코드 8xxx/9xxx도 일반 이벤트 맵으로 추정하지 않습니다. 이는 원본 시간표와 계정별 출현 조건을 혼동하지 않기 위한 구분입니다.
- 기존 페이지는 공통 스크립트가 URL의 실제 맵 ID를 읽어 일정 CSS/JS를 연결합니다. 새로 생성하는 페이지는 생성기의 일반 이벤트 맵 주입을 사용합니다. 기존 직접 주입 태그가 있으면 공통 부트스트랩이 중복으로 넣지 않습니다. 사이트에 새 맵 폴더를 추가할 때는 원본 절대 ID를 확인해 맵 명세에도 추가합니다.
- 한국판 원본 버전 15.6.1을 기준으로 `150601`을 버전 필터에 사용합니다. 이후 사이트의 한국판 기준 버전이 바뀌면 수집기의 `GAME_VERSION` 또는 `--game-version`도 함께 확인합니다.
- 날짜·요일·매월 특정 일·연간 구간·시간대를 해석하고, 기간 안에서 조건을 교차 적용합니다. 섹션/행의 개최 구간은 합집합으로 합칩니다. 시작은 포함하고 끝은 제외합니다. `2400`은 다음 날 00:00입니다.
- 현재 개최 중이거나 앞으로 400일 안에 시작하는 구간을 찾습니다. 조회 범위를 실제 종료 시각으로 사용하지 않으며, 연속 개최/연간 구간의 끝은 공식 조건의 종료 시각을 보존합니다. 원본의 `20300101 0000`도 임의로 무기한이라고 바꾸지 않고 원본 값대로 처리합니다.
- 각 맵은 가까운 구간을 최대 32개 내보냅니다. 수집은 5분마다, 유효기간은 30분이며, 분 단위의 분리된 일정 32개는 이 유효기간을 다룰 수 있습니다. 이는 파일 크기를 줄이기 위한 전송 개수 제한이며 종료일을 바꾸는 규칙이 아닙니다. 원본에 없는 미래 일정을 추정하지 않습니다.
- 마지막에 관찰된 선택적 `0`은 원래 숫자를 `unparsedTrailingValues`로 보존합니다. 필드의 게임 내부 의미는 확인하지 않았으며 별도의 맵 ID나 개최 조건으로 해석하지 않습니다. 예상하지 못한 추가 값이나 형식은 전체 갱신 실패로 처리해 부분 일정이 게시되지 않게 합니다.
- `개최까지`, `개최 중(... 남음)`, `일정 갱신 지연`과 툴팁은 이 사이트에서 작성한 표시 문구입니다. PONOS TSV에 한국어 문구가 들어 있는 것은 아닙니다. 개최 전·중 모두 같은 시간 형식 함수를 사용하며, 표시 시간이 하루 미만이면 `HH:mm:ss`, 하루 이상이면 `x일 HH:mm:ss`입니다. 개최 중 예시는 `개최 중(01:00:00 남음)`입니다. 기존 초 단위 올림 규칙은 양쪽에 동일하게 적용합니다. 사용자의 후속 요청으로 `일정 확인 불가` 문구는 제거했습니다.
- 아이템의 `현재 개최 중` 필터도 같은 검증·시각·피드를 사용합니다. 기본 해제이며, 켜면 개최 중인 이벤트와 사용자 지정 상시 계열(세계/미래/우주 및 각 좀비습격, 마계, 레전드/신 레전드/레전드 0, 발굴)만 포함합니다. EX 보상은 기존 출발 스테이지 계산을 유지하며 별도 일정으로 차단하지 않습니다. 유효한 일정을 확인할 수 없으면 상시 계열만 남습니다.
- 툴팁은 브라우저 `title`을 사용하지 않고 기존 보상 툴팁의 어두운 표면 스타일을 재사용합니다. `개최 2026.10.18 19:00:00~20:00:00` 형식이며, 종료일이 다르면 종료 날짜도 표시합니다. 수집·갱신 안내는 넣지 않습니다. 카운트다운 글꼴은 최종 요청에 따라 16px입니다.
- 카운트다운 배지는 스테이지 정보 카드와 같은 배경 `var(--surface-2)`와 테두리 `#2d3948`을 사용합니다. 왼쪽 주황색 강조선은 넣지 않습니다. 기존 글씨색과 16px를 유지하며 안쪽 여백은 5px 10px, 모서리는 8px입니다.
- 일정이 없으면 기존 레벨 선택/숨김 상태로 돌아갑니다. 계정별 해금, 클리어 횟수 제한, 사용자별 입장 가능 여부는 판정하지 않습니다.
- 날짜는 `+09:00`, 툴팁은 `Asia/Seoul`로 표시합니다. 남은 시간의 기준 시계는 방문 기기의 시계입니다. PONOS 응답의 캐시된 HTTP Date를 현재 시각으로 사용하지 않습니다.

## 검증 명령

```powershell
python -m unittest test_stage_schedule -v
pnpm --dir stage-runtime-tests install --ignore-scripts
node test_stage_schedule_runtime.cjs
```

전체 확대 후 Python 테스트 17개, JavaScript 검사 1,313개를 시스템/뉴욕 시간대에서 각각 통과했습니다. 1,226개 맵 ID의 Python/JS 정합성, 기존 페이지 공통 부트스트랩, 중복 방지, 일정 없음과 장기 종료일 보존을 포함합니다. 전체 브라우저 전수 검증과 정적 연결 검사, 대표 화면 검증은 루트 보고서에 구분합니다. 원격 Actions 실행과 공개 페이지 검증은 하지 않았습니다.
