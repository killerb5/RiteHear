const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach(node => observer.observe(node));
} else {
  revealItems.forEach(node => node.classList.add('visible'));
}

const tabGroups = document.querySelectorAll('[data-tab-group]');
tabGroups.forEach(group => {
  const buttons = Array.from(group.querySelectorAll('[data-tab]'));
  const panels = Array.from(document.querySelectorAll(`[data-tab-panel="${group.dataset.tabGroup}"]`));

  function activate(tabName) {
    buttons.forEach(button => button.classList.toggle('active', button.dataset.tab === tabName));
    panels.forEach(panel => panel.classList.toggle('hidden', panel.dataset.tab !== tabName));
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => activate(button.dataset.tab));
  });

  if (buttons[0]) activate(buttons[0].dataset.tab);
});

const dayButtons = document.querySelectorAll('[data-day]');
const dayPanels = document.querySelectorAll('[data-day-panel]');
if (dayButtons.length && dayPanels.length) {
  function showDay(day) {
    dayButtons.forEach(button => button.classList.toggle('active', button.dataset.day === day));
    dayPanels.forEach(panel => panel.classList.toggle('hidden', panel.dataset.dayPanel !== day));
  }

  dayButtons.forEach(button => {
    button.addEventListener('click', () => showDay(button.dataset.day));
  });

  showDay(dayButtons[0].dataset.day);
}

const calendarRoot = document.querySelector('[data-calendar]');
if (calendarRoot) {
  const titleNode = calendarRoot.querySelector('[data-calendar-title]');
  const gridNode = calendarRoot.querySelector('[data-calendar-grid]');
  const prevBtn = calendarRoot.querySelector('[data-calendar-prev]');
  const nextBtn = calendarRoot.querySelector('[data-calendar-next]');
  const todayBtn = calendarRoot.querySelector('[data-calendar-today]');
  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth(), 1);

  const calendarEvents = {
    '2026-4-8': 'Prime Time',
    '2026-4-10': 'Live Set',
    '2026-4-13': 'Creator Q&A',
    '2026-4-18': 'Unsigned Heat',
    '2026-4-24': 'Studio Session',
    '2026-4-29': 'Culture Roundup'
  };

  function renderCalendar() {
    if (!titleNode || !gridNode) return;
    titleNode.textContent = current.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    gridNode.innerHTML = '';

    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i -= 1) {
      const date = prevMonthDays - i;
      const cell = document.createElement('div');
      cell.className = 'calendar-day muted';
      cell.innerHTML = `<strong>${date}</strong>`;
      gridNode.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const cell = document.createElement('div');
      const key = `${year}-${month + 1}-${day}`;
      const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
      cell.className = `calendar-day${isToday ? ' today' : ''}`;
      cell.innerHTML = `<strong>${day}</strong>${calendarEvents[key] ? `<em>${calendarEvents[key]}</em>` : ''}`;
      gridNode.appendChild(cell);
    }

    const used = firstDayOfWeek + daysInMonth;
    const filler = (7 - (used % 7)) % 7;
    for (let i = 1; i <= filler; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day muted';
      cell.innerHTML = `<strong>${i}</strong>`;
      gridNode.appendChild(cell);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      current = new Date(today.getFullYear(), today.getMonth(), 1);
      renderCalendar();
    });
  }

  renderCalendar();
}

const mediaItems = document.querySelectorAll('[data-media-title]');
const mediaTitle = document.querySelector('[data-feature-title]');
const mediaChannel = document.querySelector('[data-feature-channel]');
const mediaDesc = document.querySelector('[data-feature-desc]');
const mediaMode = document.querySelector('[data-feature-mode]');

if (mediaItems.length && mediaTitle && mediaChannel && mediaDesc && mediaMode) {
  mediaItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      mediaItems.forEach(node => node.classList.remove('active'));
      item.classList.add('active');
      mediaTitle.textContent = item.dataset.mediaTitle;
      mediaChannel.textContent = item.dataset.mediaChannel;
      mediaDesc.textContent = item.dataset.mediaDesc;
      mediaMode.textContent = item.dataset.mediaMode || 'Now Streaming';
    });

    if (index === 0) item.classList.add('active');
  });
}

const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  const output = document.getElementById('uploadResult');
  uploadForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    const title = formData.get('title');
    const category = formData.get('category');
    const owner = formData.get('owner');
    const file = uploadForm.querySelector('input[type="file"]').files[0];
    output.innerHTML = `<strong>Submission queued.</strong><br>${title} by ${owner} has been prepared for the ${category} review lane.${file ? `<br>Attached file: ${file.name}` : ''}`;
    output.classList.add('show');
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const output = document.getElementById('contactResult');
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    output.innerHTML = `<strong>Inquiry queued.</strong><br>Thanks ${name}. The message from ${email} has been routed to the RiteHear team.`;
    output.classList.add('show');
  });
}

const accountForm = document.getElementById('accountForm');
if (accountForm) {
  const output = document.getElementById('accountResult');
  accountForm.addEventListener('submit', event => {
    event.preventDefault();
    localStorage.setItem('ritehear_has_account', '1');
    output.innerHTML = '<strong>Account created.</strong><br>Your creator access is now enabled. You can upload and interact with Explore content.';
    output.classList.add('show');
  });
}

const hasAccount = localStorage.getItem('ritehear_has_account') === '1';
const accountLocks = document.querySelectorAll('[data-account-lock]');
const requiresAccount = document.querySelectorAll('[data-requires-account]');

accountLocks.forEach(lock => {
  lock.classList.toggle('hidden', hasAccount);
});

requiresAccount.forEach(item => {
  if (!hasAccount) {
    if ('disabled' in item) item.disabled = true;
    item.setAttribute('aria-disabled', 'true');
    item.title = 'Create an account to interact with this content.';
  } else {
    if ('disabled' in item) item.disabled = false;
    item.removeAttribute('aria-disabled');
    item.title = '';
  }
});
