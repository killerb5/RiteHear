(function(){
  const body = document.body;
  body.classList.add('page-prep');
  const path = window.location.pathname;
  const isHome = /(^|\/)index\.html$/.test(path) || path.endsWith('/RiteHear/') || path === '/';

  function rootPrefixForPage() {
    if (isHome) return '';
    return '../../';
  }

  function navData(prefix) {
    return [
      {
        label: 'Listen',
        links: [
          { href: `${prefix}pages/listen/live-radio.html`, label: 'Live Radio' },
          { href: `${prefix}pages/listen/podcasts.html`, label: 'Podcasts' },
          { href: `${prefix}pages/listen/music.html`, label: 'Music' },
          { href: `${prefix}pages/listen/playlists.html`, label: 'Playlists' },
          { href: `${prefix}pages/listen/explore.html`, label: 'Explore' },
          { href: `${prefix}pages/listen/schedule.html`, label: 'Schedule' }
        ]
      },
      {
        label: 'Create',
        links: [
          { href: `${prefix}pages/create/create-account.html`, label: 'Create Account' },
          { href: `${prefix}pages/create/upload-music.html`, label: 'Upload Music' },
          { href: `${prefix}pages/create/start-podcast.html`, label: 'Start Podcast' },
          { href: `${prefix}pages/create/go-live.html`, label: 'Go Live' },
          { href: `${prefix}pages/create/dashboard.html`, label: 'Creator Dashboard' }
        ]
      },
      {
        label: 'Company',
        links: [
          { href: `${prefix}pages/company/about.html`, label: 'About' },
          { href: `${prefix}pages/company/advertise.html`, label: 'Advertise' },
          { href: `${prefix}pages/company/contact.html`, label: 'Contact' },
          { href: `${prefix}pages/company/privacy.html`, label: 'Privacy' }
        ]
      },
      {
        label: 'Home',
        links: [{ href: `${prefix}index.html`, label: 'Home' }]
      }
    ];
  }

  function normalizeHref(href) {
    try {
      return new URL(href, window.location.href).pathname;
    } catch (_) {
      return href;
    }
  }

  function mountInvestorNav() {
    if (isHome) return;
    const navContainer = document.querySelector('.navrow');
    if (!navContainer) return;

    const prefix = rootPrefixForPage();
    const items = navData(prefix);
    const currentPath = window.location.pathname;
    const nav = document.createElement('div');
    nav.className = 'investor-nav';

    items.forEach(group => {
      const tab = document.createElement('div');
      tab.className = 'investor-tab';

      const allLinks = group.links.map(link => normalizeHref(link.href));
      const tabIsActive = allLinks.some(linkPath => currentPath.endsWith(linkPath));

      const button = document.createElement('a');
      button.className = `investor-tab-btn${tabIsActive ? ' active' : ''}${group.links.length === 1 ? ' no-caret' : ''}`;
      button.href = group.links[0].href;
      button.textContent = group.label;
      tab.appendChild(button);

      if (group.links.length > 1) {
        const menu = document.createElement('div');
        menu.className = 'investor-menu';
        button.dataset.dropdownTrigger = '1';
        group.links.forEach(link => {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.label;
          if (currentPath.endsWith(normalizeHref(link.href))) a.classList.add('active');
          menu.appendChild(a);
        });
        tab.appendChild(menu);
      }

      nav.appendChild(tab);
    });

    navContainer.replaceWith(nav);

    const tabs = nav.querySelectorAll('.investor-tab');
    tabs.forEach(tab => {
      let closeTimer = null;
      tab.addEventListener('mouseenter', () => {
        if (closeTimer) window.clearTimeout(closeTimer);
        tab.classList.add('open');
      });
      tab.addEventListener('mouseleave', () => {
        closeTimer = window.setTimeout(() => tab.classList.remove('open'), 260);
      });

      const trigger = tab.querySelector('[data-dropdown-trigger="1"]');
      if (!trigger) return;
      trigger.addEventListener('click', event => {
        if (window.innerWidth <= 760) {
          event.preventDefault();
          tab.classList.toggle('open');
        }
      });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.investor-tab')) {
        nav.querySelectorAll('.investor-tab.open').forEach(tab => tab.classList.remove('open'));
      }
    });
  }

  function mountRichFooter() {
    if (isHome) return;
    const footer = document.querySelector('.footer');
    if (!footer) return;
    const prefix = rootPrefixForPage();
    footer.classList.add('footer-rich');
    footer.innerHTML = `
      <div class="footer-grid">
        <div>
          <img class="footer-brand-logo" src="${prefix}4020E2B9-4CDE-4648-9AA0-27DB0AA2CE6D (2).png" alt="RiteHear logo">
          <p class="footer-brand-copy">RiteHear FmXm is the premium culture-first broadcast network for live radio, podcasts, music, and creator publishing.</p>
        </div>
        <div>
          <div class="footer-col-title">Listen</div>
          <div class="footer-col-links">
            <a href="${prefix}pages/listen/live-radio.html">Live Radio</a>
            <a href="${prefix}pages/listen/podcasts.html">Podcasts</a>
            <a href="${prefix}pages/listen/music.html">Music</a>
            <a href="${prefix}pages/listen/schedule.html">Schedule</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Create</div>
          <div class="footer-col-links">
            <a href="${prefix}pages/create/create-account.html">Create Account</a>
            <a href="${prefix}pages/create/upload-music.html">Upload Music</a>
            <a href="${prefix}pages/create/start-podcast.html">Start Podcast</a>
            <a href="${prefix}pages/create/go-live.html">Go Live</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Company</div>
          <div class="footer-col-links">
            <a href="${prefix}pages/company/about.html">About</a>
            <a href="${prefix}pages/company/advertise.html">Advertise</a>
            <a href="${prefix}pages/company/contact.html">Contact</a>
            <a href="${prefix}pages/company/privacy.html">Privacy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom-row">
        <span>© 2026 RiteHear FmXm. All rights reserved.</span>
        <span>Built for the culture.</span>
      </div>
    `;
  }

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

  mountInvestorNav();
  mountRichFooter();

  const navContainer = document.querySelector('.investor-nav') || document.querySelector('.navrow') || document.querySelector('.nav-tabs');
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
