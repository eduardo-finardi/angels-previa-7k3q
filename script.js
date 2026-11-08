document.getElementById('ano').textContent = new Date().getFullYear();

// Lightbox das galerias
(async function () {
  const grid = document.querySelector('[data-gallery]');
  if (grid) {
    try {
      const r = await fetch('content/galeria.json', { cache: 'no-cache' });
      let fotos = (await r.json()).fotos || [];
      const limit = parseInt(grid.dataset.limit, 10);
      if (limit) fotos = fotos.slice(0, limit);
      grid.textContent = '';
      fotos.forEach((f, n) => {
        const a = document.createElement('a');
        a.href = f.imagem;
        if (f.larga) a.className = 'big';
        const im = document.createElement('img');
        im.src = f.imagem;
        im.alt = f.legenda || 'Foto de atendimento da Angels Moto Resgate';
        if (n > 1) im.loading = 'lazy';
        a.appendChild(im);
        grid.appendChild(a);
      });
    } catch (e) {
      grid.textContent = 'Não foi possível carregar as fotos agora.';
    }
  }
  const lb = document.getElementById('lb');
  const links = [...document.querySelectorAll('.grid a')];
  if (!lb || !links.length) return;
  const img = lb.querySelector('img');
  let i = 0;
  const show = n => {
    i = (n + links.length) % links.length;
    img.src = links[i].href;
    img.alt = links[i].querySelector('img').alt;
  };
  const open = n => { show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; };
  const close = () => { lb.hidden = true; img.src = ''; document.body.style.overflow = ''; };
  links.forEach((a, n) => a.addEventListener('click', e => { e.preventDefault(); open(n); }));
  lb.querySelector('.lb-x').onclick = close;
  lb.querySelector('.lb-prev').onclick = () => show(i - 1);
  lb.querySelector('.lb-next').onclick = () => show(i + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

// No computador não há discador: mostra o número em uma janela com copiar e WhatsApp.
(function () {
  const isPhone = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (isPhone) return;
  const NUM = '(13) 99761-7050';
  const dlg = document.createElement('div');
  dlg.className = 'lightbox call-dlg';
  dlg.hidden = true;
  dlg.innerHTML =
    '<div class="call-box" role="dialog" aria-modal="true" aria-label="Telefone do plantão">' +
    '<button class="lb-x" aria-label="Fechar">×</button>' +
    '<p class="eyebrow">Plantão · atendimento imediato</p>' +
    '<div class="phone-xl">' + NUM + '</div>' +
    '<p class="muted">Ligue do seu celular ou copie o número.</p>' +
    '<div class="cta-row center">' +
    '<button class="btn btn-call" type="button" data-copy>Copiar número</button>' +
    '<a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/5513997617050?text=Ol%C3%A1!%20Preciso%20de%20socorro%20para%20minha%20moto.">WhatsApp</a>' +
    '</div></div>';
  document.body.appendChild(dlg);
  const copy = dlg.querySelector('[data-copy]');
  const close = () => { dlg.hidden = true; copy.textContent = 'Copiar número'; };
  document.querySelectorAll('a[href^="tel:"]').forEach(a =>
    a.addEventListener('click', e => { e.preventDefault(); dlg.hidden = false; }));
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(NUM); copy.textContent = 'Copiado ✓'; }
    catch { copy.textContent = NUM; }
  };
  dlg.querySelector('.lb-x').onclick = close;
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !dlg.hidden) close(); });
})();
