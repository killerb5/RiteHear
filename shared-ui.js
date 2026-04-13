(function(){
  const body = document.body;
  body.classList.add('page-prep');

  window.requestAnimationFrame(() => {
    body.classList.add('page-ready');
    body.classList.remove('page-prep');
  });

  const navSets = [
    { group: '.nav-group', btn: '.mega-btn', panel: '.mega-panel' },
    { group: '.navgroup', btn: '.navbtn', panel: '.navmega' }
  ];

  navSets.forEach(cfg => {
    const groups = Array.from(document.querySelectorAll(cfg.group));
    if (!groups.length) return;

    let openIndex = -1;

    function menuItems(panel){
      return Array.from(panel.querySelectorAll('a'));
    }

    function closeAll(){
      groups.forEach((group, index) => {
        const btn = group.querySelector(cfg.btn);
        const panel = group.querySelector(cfg.panel);
        if (!btn || !panel) return;
        btn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('hidden', '');
        group.classList.remove('open');
        if (index === openIndex) openIndex = -1;
      });
    }

    function openAt(index, focusFirst){
      closeAll();
      const group = groups[index];
      if (!group) return;
      const btn = group.querySelector(cfg.btn);
      const panel = group.querySelector(cfg.panel);
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', 'true');
      panel.removeAttribute('hidden');
      group.classList.add('open');
      openIndex = index;
      if (focusFirst) {
        const first = menuItems(panel)[0];
        if (first) first.focus();
      }
    }

    groups.forEach((group, index) => {
      const btn = group.querySelector(cfg.btn);
      const panel = group.querySelector(cfg.panel);
      if (!btn || !panel) return;

      panel.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-haspopup', 'true');

      btn.addEventListener('click', event => {
        event.preventDefault();
        if (openIndex === index) {
          closeAll();
        } else {
          openAt(index, false);
        }
      });

      btn.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openAt(index, true);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          openAt((index + 1) % groups.length, false);
          groups[(index + 1) % groups.length].querySelector(cfg.btn)?.focus();
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const next = (index - 1 + groups.length) % groups.length;
          openAt(next, false);
          groups[next].querySelector(cfg.btn)?.focus();
        }
        if (event.key === 'Escape') {
          closeAll();
          btn.focus();
        }
      });

      panel.addEventListener('keydown', event => {
        const items = menuItems(panel);
        const current = document.activeElement;
        const i = items.indexOf(current);

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const next = items[(i + 1 + items.length) % items.length];
          next?.focus();
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          const prev = items[(i - 1 + items.length) % items.length];
          prev?.focus();
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          const nextGroup = (index + 1) % groups.length;
          openAt(nextGroup, true);
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const prevGroup = (index - 1 + groups.length) % groups.length;
          openAt(prevGroup, true);
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          closeAll();
          btn.focus();
        }
      });
    });

    document.addEventListener('click', event => {
      const inside = groups.some(group => group.contains(event.target));
      if (!inside) closeAll();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeAll();
    });
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
    }, 210);
  });
})();
