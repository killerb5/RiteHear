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
