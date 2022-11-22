(function() {
  const MAX_DAYS_NUMBER = 365;
  const STORAGE_KEY = `coin-table`;
  const INITIAL_STATE = [];
  let startDate = new Date(2022, 3, 10);
  let counter = 1;
  let sum = 1;
  
  function getDay(date) { // получить номер дня недели, от 0 (пн) до 6 (вс)
    let day = date.getDay();
    if (day == 0) day = 7; // сделать воскресенье (0) последним днем
    return day - 1;
  }
  
  function initStorageState(tableEl) {
    let state = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    if(!state  || !state.length) {
      state = INITIAL_STATE;
      for(let i = 1; state.length < 365; i++) {
        state.push({
          num: i,
          checked: false,
        });
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    }
    disp.show(state.length);
    state.forEach((el, index) => {
      if(el.checked) {
        tableEl.querySelector(`.js-day-${index + 1}`).closest(`.js-td`).classList.add(`checked`);
      }
    });
    
    return state;
  }
  
  function onCheckDateTdClick(ev) {
    const tdEl = ev.target.closest(`.js-td`);
    if(!tdEl) return;
  
    const dateNum = parseInt(tdEl.querySelector(`.js-day`).textContent);
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const targetItem = state.find(el => el.num === dateNum);
    targetItem.checked = !targetItem.checked;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    targetItem.checked ? tdEl.classList.add(`checked`) : tdEl.classList.remove(`checked`);
  }
  
  window.fillCalender = (tableEl) => {
    tableEl.addEventListener(`click`, onCheckDateTdClick);
      const month = startDate.getMonth();
      const monthStr = startDate.toLocaleString(`ru`, { month: `long` });
      let weekSum = 0;
      let monthSum = 0;
      let html = `<tbody><thead><tr><th class="coin-cal__caption">${monthStr}</th></tr><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th><th>За неделю</th></tr></thead><tr>`;
    
      // пробелы для первого ряда
      // с понедельника до первого дня месяца
      for (let i = 0; i < getDay(startDate); i++) {
        html += `<td class="coin-cal__cell"></td>`;
      }
      
      // <td> ячейки календаря с датами
      while (startDate.getMonth() === month && counter <= MAX_DAYS_NUMBER) {
      html += `<td class="coin-cal__cell js-td"><span class="coin-cal__item coin-cal__item_date">${startDate.getDate()}</span><span class="coin-cal__item coin-cal__item_day js-day js-day-${counter}">${counter} ₽</span><span class="coin-cal__item coin-cal__item_sum">${sum} ₽</span></td>`;
      weekSum += counter;
        if (getDay(startDate) % 7 == 6) { // вс, последний день - перевод строки
          html += `<td class="coin-cal__cell">${weekSum}</td></tr><tr>`;
          monthSum += weekSum;
          weekSum = 0;
        }
        
        startDate.setDate(startDate.getDate() + 1);
        counter++;
        sum += counter;
      }
    
      // добить таблицу пустыми ячейками, если нужно
      if (getDay(startDate) != 0) {
        for (let i = getDay(startDate); i < 7; i++) {
          html += `<td class="coin-cal__cell"></td>`;
        }
        html += `<td class="coin-cal__cell">${weekSum}</td>`;
        monthSum += weekSum;
      }
    
    // закрыть строку
      html += `</tr><tr><td class="coin-cal__cell"><b>За месяц</b></td><td class="coin-cal__cell">${monthSum}</td></tr></tbody>`;
      tableEl.innerHTML += html;
      
      if(counter <= MAX_DAYS_NUMBER) {
        fillCalender(tableEl);
      } else initStorageState(tableEl);
    }
})();