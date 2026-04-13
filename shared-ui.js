(function(){
  const body = document.body;
  body.classList.add('page-prep');

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
