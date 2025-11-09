(function(){
  const overlay = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-image');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const figures = Array.from(document.querySelectorAll('[data-lightbox-index]'));
  if(!overlay || !imgEl || !captionEl || figures.length === 0) return;

  let current = 0;

  function updateArrows(){
    if(figures.length < 2){
      if(prevBtn){ prevBtn.classList.add('opacity-0','pointer-events-none'); }
      if(nextBtn){ nextBtn.classList.add('opacity-0','pointer-events-none'); }
      return;
    }
    if(prevBtn){
      prevBtn.classList.toggle('opacity-30', current === 0);
      prevBtn.classList.toggle('pointer-events-none', current === 0);
    }
    if(nextBtn){
      nextBtn.classList.toggle('opacity-30', current === figures.length - 1);
      nextBtn.classList.toggle('pointer-events-none', current === figures.length - 1);
    }
  }

  function open(index){
    current = index;
    const fig = figures[current];
    const src = fig.getAttribute('data-full') || '';
    const title = fig.getAttribute('data-title') || '';
    imgEl.src = src;
    imgEl.alt = title;
    captionEl.textContent = title;
    overlay.classList.remove('hidden');
    document.documentElement.classList.add('overflow-y-hidden');
    updateArrows();
  }

  function close(){
    overlay.classList.add('hidden');
    document.documentElement.classList.remove('overflow-y-hidden');
  }

  function goPrev(){ if(current > 0) open(current - 1); }
  function goNext(){ if(current < figures.length - 1) open(current + 1); }

  figures.forEach((f) => {
    f.addEventListener('click', (e) => {
      e.preventDefault();
      const idxAttr = f.getAttribute('data-lightbox-index');
      const idx = idxAttr ? parseInt(idxAttr, 10) : 0;
      open(isNaN(idx) ? 0 : idx);
    });
  });

  if(closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) close(); });
  if(prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goPrev(); });
  if(nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goNext(); });
  window.addEventListener('keydown', (e) => {
    if(overlay.classList.contains('hidden')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') goPrev();
    else if(e.key === 'ArrowRight') goNext();
  });
})();
