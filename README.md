# 표준화 달력 프로젝트

표준화 작업을 하는 사람들을 위한 일정 관리 웹 애플리케이션입니다.

## 프로젝트 개요

이 프로젝트는 표준화 작업에 참여하는 사람들이 회의 일정과 기고서 마감일을 효율적으로 관리할 수 있도록 도와주는 웹 애플리케이션입니다. 주요 기능은 다음과 같습니다:

- 2개월 달력 표시
- 회의 날짜 선택 기능
- 기고서 마감일 자동 계산 (정기회의: 선택한 날짜로부터 12일 전, RGM: 7일 전)
- 현재 시간 표시
- URL 파라미터를 통한 날짜 공유 기능
- 키보드 네비게이션 지원

## 기술 스택

- Node.js (v18 이상)
- 순수 HTML, CSS, JavaScript (프론트엔드)
- HTTP 기본 모듈 (서버)

## 로컬 개발 환경 설정

1. 저장소 클론
   ```bash
   git clone <repository_url>
   cd standardization-calendar
   ```

2. 종속성 설치
   ```bash
   npm install
   ```

3. 개발 서버 실행
   ```bash
   npm run dev
   ```

4. 브라우저에서 `http://localhost:3000` 접속

## Vercel 배포 방법

이 프로젝트는 Vercel에 쉽게 배포할 수 있도록 구성되어 있습니다.

1. GitHub에 코드 푸시
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Vercel 대시보드에서 GitHub 저장소 가져오기
   - [Vercel](https://vercel.com) 계정에 로그인
   - "New Project" 클릭
   - GitHub 저장소 목록에서 이 프로젝트 선택
   - 기본 설정 유지 (자동으로 Node.js 프로젝트 감지)
   - "Deploy" 클릭

3. 배포 완료 후 제공된 URL로 접속하여 애플리케이션 확인

## 프로젝트 구조

```
project/
├── html/                # HTML 파일
│   ├── index.html       # 메인 페이지
│   ├── about.html       # 소개 페이지
│   └── 404.html         # 404 오류 페이지
├── css/                 # CSS 파일
│   └── style.css        # 스타일시트
├── js/                  # JavaScript 파일
│   ├── calendar.js      # 달력 기능 구현
│   └── time-display.js  # 시간 표시 기능
├── server.js            # 웹 서버 메인 파일
├── main.js              # 프로젝트 진입점
├── middlewares.js       # HTTP 요청 처리 미들웨어
├── file-manager.js      # 파일 관리 유틸리티
├── utils.js             # 유틸리티 함수 모음
├── package.json         # 프로젝트 메타데이터 및 의존성
├── vercel.json          # Vercel 배포 설정
└── vibe-spec/           # 프로젝트 명세
    └── spec.yaml        # 프로젝트 상세 스펙
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
//%%%%%LAST%%%%%