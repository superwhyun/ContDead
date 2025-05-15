/**
 * calendar.js
 * 달력 기능을 구현하는 JavaScript 코드
 */

/**
 * 달력 기능을 구현하는 Calendar 클래스
 * 2개월 달력 표시, 날짜 선택, 마감일 계산 기능 제공
 */
class Calendar {
  constructor() {
    // 기본 날짜 설정
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.selectedDate = null;
    this.regularDeadlineDate = null; // 정기회의 기고서 마감일 (선택한 날짜로부터 12일 전)
    this.rgmDeadlineDate = null; // RGM 기고서 마감일 (선택한 날짜로부터 7일 전)
    
    // 월, 요일 이름 배열
    this.months = [
      "1월", "2월", "3월", "4월", "5월", "6월",
      "7월", "8월", "9월", "10월", "11월", "12월"
    ];
    this.days = ["일", "월", "화", "수", "목", "금", "토"];
    
    // DOM 요소 참조
    this.calendarContainer = document.getElementById('calendar-container');
    this.selectedDateElement = document.getElementById('selected-date');
    this.regularDeadlineElement = document.getElementById('deadline-regular');
    this.rgmDeadlineElement = document.getElementById('deadline-rgm');
    
    this.init();
  }
  
  /**
   * 달력 초기화 및 이벤트 리스너 설정
   */
  init() {
    // 초기 달력 렌더링
    this.renderCalendars();
    
    // 이전/다음 달 네비게이션 이벤트를 document에 위임
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('prev-month')) {
        this.navigateMonth(-1);
      } else if (e.target.classList.contains('next-month')) {
        this.navigateMonth(1);
      }
    });

    // URL에서 날짜 매개변수를 확인하여 초기 선택 설정
    this.checkUrlForSelectedDate();
  }
  
  /**
   * URL에서 날짜 매개변수를 확인하고 해당 날짜 선택
   */
  checkUrlForSelectedDate() {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    
    if (dateParam) {
      try {
        const selectedDate = new Date(dateParam);
        if (!isNaN(selectedDate.getTime())) {
          // 선택된 날짜가 포함된 월로 달력 이동
          this.currentMonth = selectedDate.getMonth();
          this.currentYear = selectedDate.getFullYear();
          this.renderCalendars();
          
          // 선택된 날짜 하이라이트
          setTimeout(() => {
            const dateString = selectedDate.toISOString().split('T')[0];
            const dayEl = document.querySelector(`.day[data-date="${dateString}"]`);
            if (dayEl) {
              dayEl.click();  // 날짜 선택 이벤트 트리거
            }
          }, 100);
        }
      } catch (e) {
        console.error('URL 날짜 파라미터 처리 오류:', e);
      }
    }
  }
  
  /**
   * 두 개월 달력 렌더링
   */
  renderCalendars() {
    this.calendarContainer.innerHTML = '';
    
    // 첫 번째 달력
    const firstMonth = this.currentMonth;
    const firstYear = this.currentYear;
    
    // 두 번째 달력 (다음 달)
    const secondMonth = (this.currentMonth + 1) % 12;
    const secondYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    
    this.renderCalendar(firstMonth, firstYear);
    this.renderCalendar(secondMonth, secondYear);
    
    // 선택된 날짜가 있으면 마감일도 표시
    if (this.selectedDate) {
      this.markDeadlineDates();
    }
  }
  
  /**
   * 특정 월/년의 달력 렌더링
   * @param {number} month - 렌더링할 월 (0-11)
   * @param {number} year - 렌더링할 연도
   */
  renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarEl = document.createElement('div');
    calendarEl.className = 'calendar';
    calendarEl.setAttribute('data-month', month);
    calendarEl.setAttribute('data-year', year);
    
    // 달력 헤더
    const headerEl = document.createElement('div');
    headerEl.className = 'calendar-header';
    
    const monthYearEl = document.createElement('div');
    monthYearEl.className = 'month-year';
    monthYearEl.textContent = `${this.months[month]} ${year}`;
    
    const navEl = document.createElement('div');
    navEl.className = 'calendar-nav';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'prev-month';
    prevBtn.innerHTML = '&larr;';
    prevBtn.setAttribute('aria-label', '이전 달');
    prevBtn.setAttribute('title', '이전 달로 이동');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'next-month';
    nextBtn.innerHTML = '&rarr;';
    nextBtn.setAttribute('aria-label', '다음 달');
    nextBtn.setAttribute('title', '다음 달로 이동');
    
    navEl.appendChild(prevBtn);
    navEl.appendChild(nextBtn);
    
    headerEl.appendChild(monthYearEl);
    headerEl.appendChild(navEl);
    
    // 요일 헤더
    const weekdaysEl = document.createElement('div');
    weekdaysEl.className = 'weekdays';
    
    this.days.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.className = 'weekday';
      dayEl.textContent = day;
      weekdaysEl.appendChild(dayEl);
    });
    
    // 날짜 그리드
    const daysEl = document.createElement('div');
    daysEl.className = 'days';
    
    // 이전 달의 날짜로 채우기
    for (let i = 0; i < firstDay; i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'day disabled';
      daysEl.appendChild(dayEl);
    }
    
    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'day';
      
      const currentDate = new Date(year, month, i);
      const dateValue = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      dayEl.setAttribute('data-date', dateValue);
      
      // 오늘 날짜 표시
      if (
        this.today.getDate() === i &&
        this.today.getMonth() === month &&
        this.today.getFullYear() === year
      ) {
        dayEl.classList.add('today');
        dayEl.setAttribute('title', '오늘');
      }
      
      // 선택된 날짜 표시
      if (
        this.selectedDate &&
        this.selectedDate.getDate() === i &&
        this.selectedDate.getMonth() === month &&
        this.selectedDate.getFullYear() === year
      ) {
        dayEl.classList.add('selected');
      }
      
      // 정기회의 기고서 마감일 표시
      if (
        this.regularDeadlineDate &&
        this.regularDeadlineDate.getDate() === i &&
        this.regularDeadlineDate.getMonth() === month &&
        this.regularDeadlineDate.getFullYear() === year
      ) {
        dayEl.classList.add('deadline-regular');
        dayEl.setAttribute('title', '정기회의 기고서 마감일');
      }
      
      // RGM 기고서 마감일 표시
      if (
        this.rgmDeadlineDate &&
        this.rgmDeadlineDate.getDate() === i &&
        this.rgmDeadlineDate.getMonth() === month &&
        this.rgmDeadlineDate.getFullYear() === year
      ) {
        // 정기회의와 RGM 마감일이 같은 날인 경우
        if (dayEl.classList.contains('deadline-regular')) {
          dayEl.classList.remove('deadline-regular');
          dayEl.classList.add('deadline-both');
          dayEl.setAttribute('title', '정기회의 & RGM 기고서 마감일');
        } else {
          dayEl.classList.add('deadline-rgm');
          dayEl.setAttribute('title', 'RGM 기고서 마감일');
        }
      }
      
      const dayNumberEl = document.createElement('div');
      dayNumberEl.className = 'day-number';
      dayNumberEl.textContent = i;
      
      dayEl.appendChild(dayNumberEl);
      
      // 날짜 클릭 이벤트
      dayEl.addEventListener('click', () => {
        this.selectDate(new Date(year, month, i));
      });
      
      daysEl.appendChild(dayEl);
    }
    
    calendarEl.appendChild(headerEl);
    calendarEl.appendChild(weekdaysEl);
    calendarEl.appendChild(daysEl);
    
    this.calendarContainer.appendChild(calendarEl);
  }
  
  /**
   * 날짜 선택 처리
   * @param {Date} date - 선택된 날짜
   */
  selectDate(date) {
    // 이전에 선택된 날짜의 'selected' 클래스 제거
    const prevSelected = document.querySelectorAll('.day.selected');
    prevSelected.forEach(el => el.classList.remove('selected'));
    
    // 이전 마감일 클래스 제거
    const prevRegularDeadline = document.querySelectorAll('.day.deadline-regular');
    prevRegularDeadline.forEach(el => el.classList.remove('deadline-regular'));
    
    const prevRgmDeadline = document.querySelectorAll('.day.deadline-rgm');
    prevRgmDeadline.forEach(el => el.classList.remove('deadline-rgm'));
    
    const prevBothDeadline = document.querySelectorAll('.day.deadline-both');
    prevBothDeadline.forEach(el => el.classList.remove('deadline-both'));
    
    // 선택된 날짜 저장
    this.selectedDate = date;
    
    // 선택된 날짜에 'selected' 클래스 추가
    const dateString = date.toISOString().split('T')[0];
    const selectedDayEl = document.querySelector(`.day[data-date="${dateString}"]`);
    if (selectedDayEl) {
      selectedDayEl.classList.add('selected');
    }
    
    // 기고서 마감일 계산 (정기회의, RGM)
    this.calculateDeadlineDates();
    
    // 선택된 날짜와 마감일 표시 업데이트
    this.updateSelectedDate();
    
    // 마감일을 달력에 표시
    this.markDeadlineDates();
    
    // URL 업데이트
    this.updateUrlWithSelectedDate();
  }
  
  /**
   * 기고서 마감일 계산 (정기회의: 12일 전, RGM: 7일 전)
   */
  calculateDeadlineDates() {
    if (this.selectedDate) {
      // 정기회의 기고서 마감일 (선택한 날짜로부터 12일 전)
      const regularDeadline = new Date(this.selectedDate);
      regularDeadline.setDate(regularDeadline.getDate() - 12);
      this.regularDeadlineDate = regularDeadline;
      
      // RGM 기고서 마감일 (선택한 날짜로부터 7일 전)
      const rgmDeadline = new Date(this.selectedDate);
      rgmDeadline.setDate(rgmDeadline.getDate() - 7);
      this.rgmDeadlineDate = rgmDeadline;
    } else {
      this.regularDeadlineDate = null;
      this.rgmDeadlineDate = null;
    }
  }
  
  /**
   * 마감일을 달력에 표시
   */
  markDeadlineDates() {
    // 정기회의 마감일 표시
    if (this.regularDeadlineDate) {
      const regularDateString = this.regularDeadlineDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const regularDeadlineDay = document.querySelector(`.day[data-date="${regularDateString}"]`);
      
      if (regularDeadlineDay) {
        regularDeadlineDay.classList.add('deadline-regular');
        regularDeadlineDay.setAttribute('title', '정기회의 기고서 마감일');
      }
    }
    
    // RGM 마감일 표시
    if (this.rgmDeadlineDate) {
      const rgmDateString = this.rgmDeadlineDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const rgmDeadlineDay = document.querySelector(`.day[data-date="${rgmDateString}"]`);
      
      if (rgmDeadlineDay) {
        // 두 마감일이 같은 날인 경우
        if (rgmDeadlineDay.classList.contains('deadline-regular')) {
          rgmDeadlineDay.classList.remove('deadline-regular');
          rgmDeadlineDay.classList.add('deadline-both');
          rgmDeadlineDay.setAttribute('title', '정기회의 & RGM 기고서 마감일');
        } else {
          rgmDeadlineDay.classList.add('deadline-rgm');
          rgmDeadlineDay.setAttribute('title', 'RGM 기고서 마감일');
        }
      }
    }
  }
  
  /**
   * URL에 선택된 날짜 정보 추가
   */
  updateUrlWithSelectedDate() {
    if (this.selectedDate) {
      const dateString = this.selectedDate.toISOString().split('T')[0];
      const url = new URL(window.location.href);
      url.searchParams.set('date', dateString);
      window.history.replaceState({}, '', url);
    }
  }
  
  /**
   * 선택된 날짜 및 마감일 정보 업데이트
   */
  updateSelectedDate() {
    if (this.selectedDate) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = this.selectedDate.toLocaleDateString('ko-KR', options);
      
      this.selectedDateElement.innerHTML = `
        <span class="date-label">선택한 날짜</span>
        <div class="date-info">${formattedDate}</div>
      `;
      
      // 정기회의 마감일 정보 업데이트
      if (this.regularDeadlineDate) {
        const formattedRegularDeadline = this.regularDeadlineDate.toLocaleDateString('ko-KR', options);
        const regularDaysRemaining = this.getDayDifference(this.regularDeadlineDate, this.today);
        
        let regularDeadlineStatus = '';
        if (regularDaysRemaining < 0) {
          regularDeadlineStatus = '<span class="deadline-warning regular">마감일이 지났습니다!</span>';
        } else if (regularDaysRemaining === 0) {
          regularDeadlineStatus = '<span class="deadline-warning regular">오늘이 마감일입니다!</span>';
        } else if (regularDaysRemaining <= 3) {
          regularDeadlineStatus = `<span class="deadline-warning regular">마감일까지 ${regularDaysRemaining}일 남았습니다!</span>`;
        }
        
        this.regularDeadlineElement.innerHTML = `
          <span class="date-label">정기회의 기고서 마감일 (12일 전)</span>
          <div class="date-info">${formattedRegularDeadline}</div>
          ${regularDeadlineStatus}
        `;
      } else {
        this.regularDeadlineElement.innerHTML = `
          <span class="date-label">정기회의 기고서 마감일 (12일 전)</span>
          <div class="date-info">계산 중...</div>
        `;
      }
      
      // RGM 마감일 정보 업데이트
      if (this.rgmDeadlineDate) {
        const formattedRgmDeadline = this.rgmDeadlineDate.toLocaleDateString('ko-KR', options);
        const rgmDaysRemaining = this.getDayDifference(this.rgmDeadlineDate, this.today);
        
        let rgmDeadlineStatus = '';
        if (rgmDaysRemaining < 0) {
          rgmDeadlineStatus = '<span class="deadline-warning rgm">마감일이 지났습니다!</span>';
        } else if (rgmDaysRemaining === 0) {
          rgmDeadlineStatus = '<span class="deadline-warning rgm">오늘이 마감일입니다!</span>';
        } else if (rgmDaysRemaining <= 3) {
          rgmDeadlineStatus = `<span class="deadline-warning rgm">마감일까지 ${rgmDaysRemaining}일 남았습니다!</span>`;
        }
        
        this.rgmDeadlineElement.innerHTML = `
          <span class="date-label">RGM 기고서 마감일 (7일 전)</span>
          <div class="date-info">${formattedRgmDeadline}</div>
          ${rgmDeadlineStatus}
        `;
      } else {
        this.rgmDeadlineElement.innerHTML = `
          <span class="date-label">RGM 기고서 마감일 (7일 전)</span>
          <div class="date-info">계산 중...</div>
        `;
      }
    } else {
      this.selectedDateElement.innerHTML = `
        <span class="date-label">선택한 날짜</span>
        <div class="date-info">날짜를 선택해주세요</div>
      `;
      
      this.regularDeadlineElement.innerHTML = `
        <span class="date-label">정기회의 기고서 마감일 (12일 전)</span>
        <div class="date-info">날짜를 선택해주세요</div>
      `;
      
      this.rgmDeadlineElement.innerHTML = `
        <span class="date-label">RGM 기고서 마감일 (7일 전)</span>
        <div class="date-info">날짜를 선택해주세요</div>
      `;
    }
  }
  
  /**
   * 두 날짜 간의 일수 차이 계산
   * @param {Date} date1 - 첫 번째 날짜
   * @param {Date} date2 - 두 번째 날짜
   * @returns {number} - 일수 차이
   */
  getDayDifference(date1, date2) {
    // 시간, 분, 초, 밀리초를 제거하여 날짜만 비교
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    
    // 밀리초 차이를 일 단위로 변환
    const diffTime = d1 - d2;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  /**
   * 이전/다음 달로 달력 이동
   * @param {number} direction - 이동 방향 (-1: 이전 달, 1: 다음 달)
   */
  navigateMonth(direction) {
    this.currentMonth += direction;
    
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    
    this.renderCalendars();
    
    // 선택된 날짜가 있으면 업데이트
    if (this.selectedDate) {
      const dateString = this.selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const selectedDay = document.querySelector(`.day[data-date="${dateString}"]`);
      
      if (selectedDay) {
        selectedDay.classList.add('selected');
      }
      
      // 마감일 표시 업데이트
      this.markDeadlineDates();
    }
  }
}

// 페이지 로드 시 달력 초기화 및 키보드 네비게이션 설정
document.addEventListener('DOMContentLoaded', () => {
  const calendar = new Calendar();
  
  // 키보드 네비게이션 지원
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      document.querySelector('.prev-month')?.click();
    } else if (e.key === 'ArrowRight') {
      document.querySelector('.next-month')?.click();
    }
  });
});