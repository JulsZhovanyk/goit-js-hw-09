import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  daysTimer: document.querySelector('[data-days]'),
  hoursTimer: document.querySelector('[data-hours]'),
  minutesTimer: document.querySelector('[data-minutes]'),
  secondsTimer: document.querySelector('[data-seconds]'),
  container: document.querySelector('.timer'),
};

refs.container.setAttribute(
  'style',
  'display:flex; gap:15px; border:solid green 2px; margin:10px; padding: 5px; width:350px'
);
refs.startBtn.setAttribute('disabled', 'true');

let futureDate = null;
let isActive = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= options.defaultDate) {
      Notiflix.Notify.warning('Будь ласка, виберіть дату в майбутньому!');
    } else {
      refs.startBtn.removeAttribute('disabled');
    }

    futureDate = selectedDates[0];
  },
};

flatpickr('input#datetime-picker', options);

refs.startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  if (isActive) {
    return;
  }

  isActive = true;

  const timer = setInterval(() => {
    if (Date.now() >= futureDate) {
      clearInterval(timer);
      return;
    }
    const deltaTime = futureDate - Date.now();
    const timeConvert = convertMs(deltaTime);
    const { days, hours, minutes, seconds } = timeConvert;
    refs.daysTimer.textContent = days;
    refs.hoursTimer.textContent = hours;
    refs.minutesTimer.textContent = minutes;
    refs.secondsTimer.textContent = seconds;
  }, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
