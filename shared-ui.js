(function(){
  const body = document.body;
  body.classList.add('page-prep');

  if (window.innerWidth > 768 && !document.getElementById('cursor') && !document.getElementById('cursorRing')) {
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    cursor.className = 'cursor';

    const ring = document.createElement('div');
    ring.id = 'cursorRing';
    ring.className = 'cursor-ring';

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .cursor{position:fixed;width:12px;height:12px;background:#FF7A18;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);}
      .cursor-ring{position:fixed;width:36px;height:36px;border:1.5px solid #FF7A18;border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:.5;}
      @media (max-width:768px){.cursor,.cursor-ring{display:none;}}
    `;

    document.head.appendChild(cursorStyle);
    document.body.append(cursor, ring);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    function animateCursor() {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      window.requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }

  const style = document.createElement('style');
  style.textContent = `
    .session-ui{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;}
    .session-pill{border:1px solid rgba(255,122,24,.25);background:rgba(255,122,24,.12);color:#fff;border-radius:999px;padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;}
    .session-signout{border:1px solid rgba(255,122,24,.25);background:transparent;color:rgba(245,247,250,.75);border-radius:999px;padding:8px 11px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;cursor:pointer;}
  `;
  document.head.appendChild(style);

  const hasAccount = localStorage.getItem('ritehear_has_account') === '1';
  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem('ritehear_profile') || 'null');
  } catch (_) {
    profile = null;
  }

  const navContainer = document.querySelector('.navrow') || document.querySelector('.nav-tabs');
  if (navContainer && hasAccount && profile && profile.name) {
    const ui = document.createElement('div');
    ui.className = 'session-ui';
    ui.innerHTML = `
      <span class="session-pill">Signed in as ${profile.name}</span>
      <button class="session-signout" type="button">Sign Out</button>
    `;
    navContainer.appendChild(ui);

    const signOutBtn = ui.querySelector('.session-signout');
    signOutBtn.addEventListener('click', () => {
      localStorage.removeItem('ritehear_has_account');
      localStorage.removeItem('ritehear_profile');
      window.location.reload();
    });
  }

  window.requestAnimationFrame(() => {
    body.classList.remove('page-prep');
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const isHash = href.startsWith('#');
    const isExternal = link.target === '_blank' || /^https?:/i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    if (isHash || isExternal || href === '') return;

    event.preventDefault();
    body.classList.add('page-leave');
    window.setTimeout(() => {
      window.location.href = href;
    }, 200);
  });
})();
