/**
 * file-manager.js
 * 필요한 디렉토리와 파일을 확인하고 생성하는 기능을 제공
 */

const fs = require('fs');
const path = require('path');

/**
 * 필요한 디렉토리와 파일 확인/생성
 * @param {string} baseDir - 프로젝트 기본 디렉토리 경로
 */
function ensureDirectoriesAndFiles(baseDir) {
  // html 디렉토리 확인
  if (!fs.existsSync(path.join(baseDir, 'html'))) {
    fs.mkdirSync(path.join(baseDir, 'html'), { recursive: true });
    console.log('html 디렉토리가 생성되었습니다.');
  }
  
  // css 디렉토리 확인
  if (!fs.existsSync(path.join(baseDir, 'css'))) {
    fs.mkdirSync(path.join(baseDir, 'css'), { recursive: true });
    console.log('css 디렉토리가 생성되었습니다.');
  }
  
  // js 디렉토리 확인
  if (!fs.existsSync(path.join(baseDir, 'js'))) {
    fs.mkdirSync(path.join(baseDir, 'js'), { recursive: true });
    console.log('js 디렉토리가 생성되었습니다.');
  }
  
  // 404 페이지 확인/생성
  createNotFoundPage(baseDir);
  
  // about 페이지 확인/생성
  createAboutPage(baseDir);
}

/**
 * 404 오류 페이지 생성
 * @param {string} baseDir - 프로젝트 기본 디렉토리 경로
 */
function createNotFoundPage(baseDir) {
  if (!fs.existsSync(path.join(baseDir, 'html', '404.html'))) {
    const notFoundHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - 페이지를 찾을 수 없습니다 | 표준화 달력</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header>
    <div class="container">
      <a href="/" class="logo">표준화 달력</a>
    </div>
  </header>

  <main class="container">
    <div class="content-box">
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지를 찾을 수 없습니다. URL을 확인하시고 다시 시도해주세요.</p>
      <p>
        <a href="/" class="btn">홈으로 돌아가기</a>
      </p>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2025 표준화 달력 프로젝트. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(baseDir, 'html', '404.html'), notFoundHtml);
    console.log('404.html 파일이 생성되었습니다.');
  }
}

/**
 * About 페이지 생성
 * @param {string} baseDir - 프로젝트 기본 디렉토리 경로
 */
function createAboutPage(baseDir) {
  if (!fs.existsSync(path.join(baseDir, 'html', 'about.html'))) {
    const aboutHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About - 표준화 달력 프로젝트</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header>
    <div class="container">
      <a href="/" class="logo">표준화 달력</a>
    </div>
  </header>

  <main class="container">
    <div class="content-box">
      <h1>About - 표준화 달력 프로젝트</h1>
      <p>이 웹 애플리케이션은 표준화 작업을 하는 분들의 일정 관리를 돕기 위해 개발되었습니다. 회의 날짜와 각 회의 유형(정기회의, RGM)에 따른 기고서 마감일을 쉽게 확인할 수 있도록 설계되었습니다.</p>
      
      <div class="highlight">
        <h2>프로젝트 목적</h2>
        <p>표준화 업무를 진행하는 과정에서 회의 일정과 문서 제출 기한을 쉽게 파악하는 것은 매우 중요합니다. 이 애플리케이션은 사용자가 회의 날짜를 선택하면 자동으로 각 회의 유형별 기고서 마감일(정기회의: 12일 전, RGM: 7일 전)을 계산하여 보여줌으로써, 일정 관리의 편의성을 높이고 마감일을 놓치지 않도록 도와줍니다.</p>
      </div>
      
      <div class="highlight">
        <h2>주요 기능</h2>
        <ul style="margin-left: 20px; margin-bottom: 15px;">
          <li>2개월 달력 한눈에 보기</li>
          <li>회의 날짜 선택 기능</li>
          <li>정기회의 기고서 마감일 자동 계산 (회의 12일 전)</li>
          <li>RGM 기고서 마감일 자동 계산 (회의 7일 전)</li>
          <li>마감일 상태 알림 (마감 임박, 마감일 등)</li>
        </ul>
      </div>
      
      <p>이 프로젝트는 Node.js의 http 모듈을 사용하여 구축되었으며, 순수 JavaScript를 활용하여 달력 기능을 구현했습니다. 모든 처리는 클라이언트 측에서 이루어져 서버 부하가 적고 응답 속도가 빠릅니다.</p>
      
      <div class="highlight">
        <h2>개발 배경</h2>
        <p>표준화 작업을 진행하는 많은 전문가들이 다양한 회의와 문서 제출 일정을 관리하는 과정에서 어려움을 겪고 있습니다. 특히 여러 표준화 기구의 회의가 겹치는 경우, 각 회의별 마감일을 계산하는 것은 번거로운 작업입니다. 이 도구는 그러한 불편함을 해소하고, 사용자가 중요한 마감일을 놓치지 않도록 돕기 위해 개발되었습니다.</p>
      </div>
      
      <p>앞으로도 표준화 업무를 지원하기 위한 다양한 기능이 추가될 예정입니다. 피드백과 제안은 언제나 환영합니다.</p>
      
      <p style="margin-top: 20px;">
        <a href="/" class="btn">홈으로 돌아가기</a>
        <a href="/vibe-spec/spec.yaml" class="btn" style="margin-left: 10px; background-color: #2ecc71;">프로젝트 명세서</a>
      </p>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2025 표준화 달력 프로젝트. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(baseDir, 'html', 'about.html'), aboutHtml);
    console.log('about.html 파일이 생성되었습니다.');
  }
}

module.exports = {
  ensureDirectoriesAndFiles,
  createNotFoundPage,
  createAboutPage
};