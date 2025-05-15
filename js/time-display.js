/**
 * time-display.js
 * 현재 시간을 표시하고 매초 업데이트하는 기능
 */

/**
 * 현재 시간 표시 및 매초 업데이트하는 함수
 * 현재 시간을 가져와 화면에 표시하고 1초마다 업데이트
 */
function updateTime() {
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false
  };
  document.getElementById('current-time').textContent = now.toLocaleString('ko-KR', options);
}

// 페이지 로드 시 시간 표시 초기화 및 1초마다 업데이트
document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  setInterval(updateTime, 1000);
});