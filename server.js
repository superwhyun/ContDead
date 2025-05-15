/**
 * server.js
 * 표준화 달력 프로젝트의 웹 서버 메인 파일
 * Vercel 배포를 위해 최적화됨
 */

const http = require('http');
const path = require('path');
const { updateSpecLastUpdated } = require('./utils');
const { ensureDirectoriesAndFiles } = require('./file-manager');
const { serveStaticFile } = require('./middlewares');

// 프로젝트 기본 디렉토리 경로
const baseDir = __dirname;

// Vercel 배포 환경에서는 spec.yaml 파일 업데이트 건너뛰기
if (process.env.NODE_ENV !== 'production') {
  updateSpecLastUpdated(baseDir);
}

// 서버 포트 설정 (환경 변수가 있으면 사용, 없으면 3000 포트 사용)
const PORT = process.env.PORT || 3000;

// HTTP 요청 핸들러 함수
const requestHandler = (req, res) => {
  // 정적 파일 제공 미들웨어로 요청 처리 시도
  serveStaticFile(req, res, baseDir);
};

// Vercel 서버리스 환경에서 사용하기 위한 모듈 내보내기
module.exports = (req, res) => {
  requestHandler(req, res);
};

// 로컬 개발 환경에서만 HTTP 서버 시작
if (process.env.NODE_ENV !== 'production') {
  const server = http.createServer(requestHandler);
  
  server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT}에서 확인할 수 있습니다.`);
    
    // 서버 시작 시 필요한 디렉토리와 파일 확인/생성
    ensureDirectoriesAndFiles(baseDir);
  });
} //%%%%% LAST %%%%%