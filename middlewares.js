/**
 * middlewares.js
 * HTTP 요청 처리를 위한 미들웨어 함수들
 */

const fs = require('fs');
const path = require('path');
const url = require('url');
const { MIME_TYPES } = require('./utils');

/**
 * 정적 파일 제공 미들웨어
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} res - HTTP 응답 객체
 * @param {string} baseDir - 프로젝트 기본 디렉토리 경로
 * @returns {boolean} - 요청이 처리되었는지 여부
 */
function serveStaticFile(req, res, baseDir) {
  // URL 파싱
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  // 경로가 '/'인 경우 html/index.html로 리디렉션
  if (pathname === '/') {
    pathname = '/html/index.html';
  }
  
  // about 페이지 처리
  if (pathname === '/about') {
    pathname = '/html/about.html';
  }
  
  // HTML 파일 처리 경로 조정 (index.html이 아닌 경우)
  if (pathname.endsWith('.html') && !pathname.startsWith('/html/')) {
    pathname = `/html${pathname}`;
  }
  
  // 파일 경로 생성
  const filePath = path.join(baseDir, pathname);
  
  // 파일 확장자 추출
  const extname = path.extname(filePath);
  
  // 기본 Content-Type은 text/plain
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  // 파일 읽기 시도
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      return true; // 파일을 성공적으로 제공
    }
  } catch (err) {
    return handleServerError(res, err);
  }
  
  return handle404(res, baseDir);
}

/**
 * 404 오류 처리 미들웨어
 * @param {Object} res - HTTP 응답 객체
 * @param {string} baseDir - 프로젝트 기본 디렉토리 경로
 * @returns {boolean} - 요청이 처리되었는지 여부
 */
function handle404(res, baseDir) {
  try {
    const notFoundPath = path.join(baseDir, 'html', '404.html');
    if (fs.existsSync(notFoundPath)) {
      const content = fs.readFileSync(notFoundPath);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    } else {
      // 404 페이지도 없는 경우 간단한 텍스트 응답
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  } catch (err) {
    // 404 페이지 처리 중 오류 발생
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
  return true;
}

/**
 * 서버 오류 처리 미들웨어
 * @param {Object} res - HTTP 응답 객체
 * @param {Error} err - 발생한 오류 객체
 * @returns {boolean} - 요청이 처리되었는지 여부
 */
function handleServerError(res, err) {
  console.error('서버 오류:', err.code);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(`Server Error: ${err.code}`);
  return true;
}

module.exports = {
  serveStaticFile,
  handle404,
  handleServerError
};