/**
 * index.js
 * Vercel 서버리스 함수의 진입점
 */

const path = require('path');
const { serveStaticFile } = require('../middlewares');

// 프로젝트 기본 디렉토리 경로
const baseDir = path.join(__dirname, '..');

// Vercel 서버리스 함수
module.exports = (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 정적 파일 제공 미들웨어로 요청 처리
  serveStaticFile(req, res, baseDir);
};