/**
 * utils.js
 * 표준화 달력 프로젝트의 유틸리티 함수 모음
 */

const fs = require('fs');
const path = require('path');

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
 * @returns {string} YYYY-MM-DD 형식의 현재 날짜
 */
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * spec.yaml 파일의 last_updated 필드를 현재 날짜로 업데이트하는 함수
 * @param {string} baseDir - 프로젝트 기본 디렉토리 경로
 */
function updateSpecLastUpdated(baseDir) {
  const specPath = path.join(baseDir, 'vibe-spec', 'spec.yaml');
  
  if (fs.existsSync(specPath)) {
    let specContent = fs.readFileSync(specPath, 'utf8');
    // last_updated 필드를 현재 날짜로 업데이트
    specContent = specContent.replace(
      /last_updated: ".*?"/,
      `last_updated: "${getCurrentDate()}"`
    );
    fs.writeFileSync(specPath, specContent, 'utf8');
    console.log('spec.yaml 파일의 last_updated 필드가 업데이트되었습니다.');
  }
}

// MIME 타입 매핑 객체 - 파일 확장자에 따른 Content-Type 지정
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.yaml': 'application/yaml',
  '.yml': 'application/yaml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
}; //%%%%% LAST %%%%%

module.exports = {
  getCurrentDate,
  updateSpecLastUpdated,
  MIME_TYPES
};