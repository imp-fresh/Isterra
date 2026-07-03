/* ============ DATOS ============
   Los datos de productos, categorías, portada y reseñas viven en
   js/catalog-data.js (se carga antes que este archivo). */

/* ============ ESTADO ============ */
let cart = [];
let currentDiscount = 0;
let reviewStars = 0;
let reviews = [...REVIEWS_BASE];
let qvProduct = null;
let qvSwatchIdx = 0;
let qvQty = 1;

/* ============ HELPERS ============ */
function money(n){ return '$' + n.toLocaleString('es-CL'); }
function badgeHTML(b){
  if(b==='best') return '<span class="badge badge-best">⭐ Favorito</span>';
  if(b==='popular') return '<span class="badge badge-popular">🔥 Popular</span>';
  if(b==='new') return '<span class="badge badge-new">Nuevo</span>';
  if(b==='classic') return '<span class="badge badge-classic">Clásico</span>';
  return '';
}
function swatchesHTML(swatches){
  if(!swatches || swatches.length<2) return '';
  return '<div class="swatch-row">' + swatches.map(c=>`<span class="swatch" style="background:${c}"></span>`).join('') + '</div>';
}

/* ============ RENDER: PRODUCT GRID ============ */
function renderProducts(cat){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  const list = cat==='todos' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===cat);
  grid.innerHTML = list.map(p=>`
    <div class="product-card">
      <div class="product-img-wrap">
        ${badgeHTML(p.badge)}
        <div class="quick-actions">
          <button class="qa-btn" onclick="openQuickView(${p.id})" title="Vista rápida"><i class="ti ti-eye"></i></button>
          <button class="qa-btn" onclick="window.open('https://www.instagram.com/isterra_textil/','_blank')" title="Ver en Instagram"><i class="ti ti-brand-instagram"></i></button>
        </div>
        <img src="${p.img}" alt="${p.name}" loading="lazy" onclick="openQuickView(${p.id})">
        <div class="product-add-row">
          <button class="product-add-btn" onclick="addToCart(${p.id})">+ Agregar al carrito</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-variant">${p.variant}</div>
        <div class="product-price">${money(p.price)} CLP</div>
        ${swatchesHTML(p.swatches)}
      </div>
    </div>`).join('');
}

/* ============ CATEGORY ACCORDION (colapsable con preview rotativo) ============ */
let openCategoryKey = null;
let catTileTimers = [];

function catTileImages(key){
  const list = key==='todos' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===key);
  const imgs = list.map(p=>p.img);
  return imgs.length ? imgs.slice(0,5) : ['img/logo.png'];
}

function renderCatAccordion(){
  const row = document.getElementById('cat-accordion');
  if(!row) return;
  row.innerHTML = CATEGORIES.map(c=>{
    const imgs = catTileImages(c.key);
    const slides = imgs.map((src,i)=>`<div class="cat-tile-slide ${i===0?'active':''}" data-i="${i}"><img src="${src}" alt="${c.label}" loading="lazy"></div>`).join('');
    return `
    <div class="cat-tile" id="cat-tile-${c.key}" onclick="toggleCategoryPanel('${c.key}')">
      ${slides}
      <div class="cat-tile-scrim"></div>
      <div class="cat-tile-icon"><i class="ti ti-plus"></i></div>
      <div class="cat-tile-label"><div>${c.label}</div><small>${c.sub}</small></div>
    </div>`;
  }).join('');

  // limpia timers previos y arranca rotación individual por tile
  catTileTimers.forEach(t=>clearInterval(t));
  catTileTimers = CATEGORIES.map((c,idx)=>{
    const imgs = catTileImages(c.key);
    if(imgs.length<2) return null;
    let i=0;
    return setInterval(()=>{
      const tile = document.getElementById('cat-tile-'+c.key);
      if(!tile) return;
      const slides = tile.querySelectorAll('.cat-tile-slide');
      slides[i].classList.remove('active');
      i = (i+1)%slides.length;
      slides[i].classList.add('active');
    }, 2200 + idx*260);
  }).filter(Boolean);
}

function toggleCategoryPanel(key){
  if(openCategoryKey===key){ closeCategoryPanel(); return; }
  openCategoryPanel(key);
}

function openCategoryPanel(key){
  openCategoryKey = key;
  document.querySelectorAll('.cat-tile').forEach(t=>t.classList.remove('active'));
  const tile = document.getElementById('cat-tile-'+key);
  if(tile) tile.classList.add('active');

  renderProducts(key);
  const bc = document.getElementById('breadcrumb-label');
  const label = CATEGORIES.find(c=>c.key===key)?.label || 'Colección';
  if(bc) bc.textContent = label;

  const panel = document.getElementById('cat-panel');
  panel.classList.add('open');
}

function closeCategoryPanel(){
  openCategoryKey = null;
  document.querySelectorAll('.cat-tile').forEach(t=>t.classList.remove('active'));
  document.getElementById('cat-panel').classList.remove('open');
}

/* ============ RENDER: CATEGORY CIRCLES ============ */
function renderCategories(){
  const row = document.getElementById('cat-row');
  if(!row) return;
  row.innerHTML = CATEGORIES.filter(c=>c.key!=='todos').map(c=>{
    const first = PRODUCTS.find(p=>p.cat===c.key);
    return `
    <button class="cat-circle-btn" onclick="goToCategory('${c.key}')">
      <div class="cat-circle"><img src="${first ? first.img : ''}" alt="${c.label}" loading="lazy"></div>
      <div class="cat-label">${c.label}</div>
    </button>`;
  }).join('');
}
function goToCategory(key){
  smoothScrollToEl('products-section');
  setTimeout(()=>{ openCategoryPanel(key); }, 400);
}

/* ============ RENDER: INSTAGRAM ============ */
function renderIG(){
  const grid = document.getElementById('ig-grid');
  if(!grid) return;
  grid.innerHTML = IG_ITEMS.map(i=>`
    <div class="ig-card" onclick="window.open('https://www.instagram.com/isterra_textil/','_blank')">
      <img src="${i.img}" alt="${i.label}" loading="lazy">
      <div class="ig-card-overlay"><i class="ti ti-brand-instagram"></i><span>${i.label}</span></div>
    </div>`).join('');
}

/* ============ RENDER: REVIEWS ============ */
function renderReviews(){
  const list = document.getElementById('reviews-grid');
  if(!list) return;
  list.innerHTML = reviews.map(r=>`
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-foot">
        <div class="review-avatar">${r.name.charAt(0)}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-prod">${r.product ? r.product+' · ' : ''}${r.date}</div>
        </div>
      </div>
    </div>`).join('');
}

function setStars(n){
  reviewStars = n;
  document.querySelectorAll('.star-btn').forEach((b,i)=>b.classList.toggle('lit', i<n));
}

function submitReview(){
  const name = document.getElementById('rev-name').value.trim();
  const text = document.getElementById('rev-text').value.trim();
  const product = document.getElementById('rev-product').value.trim();
  const msg = document.getElementById('rev-msg');
  if(!name || !text || !reviewStars){
    msg.innerHTML = '<span style="color:#C62828">Completa nombre, estrellas y reseña.</span>';
    return;
  }
  reviews.unshift({name, product, stars:reviewStars, text, date:'Hoy'});
  renderReviews();
  document.getElementById('rev-name').value='';
  document.getElementById('rev-text').value='';
  document.getElementById('rev-product').value='';
  setStars(0);
  msg.innerHTML = '<span style="color:#2E7D32">✓ ¡Gracias por tu reseña!</span>';
  setTimeout(()=>msg.innerHTML='', 4000);
  showToast('¡Reseña publicada! Gracias ✨');
}

/* ============ QUICK VIEW MODAL ============ */
function openQuickView(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  qvProduct = p;
  qvSwatchIdx = 0;
  qvQty = 1;
  renderQuickView();
  document.getElementById('qv-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeQuickView(){
  document.getElementById('qv-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function renderQuickView(){
  const p = qvProduct;
  if(!p) return;
  document.getElementById('qv-img').src = p.img;
  document.getElementById('qv-img').alt = p.name;
  document.getElementById('qv-badge-wrap').innerHTML = badgeHTML(p.badge);
  document.getElementById('qv-name').textContent = p.name;
  document.getElementById('qv-variant').textContent = p.variant;
  document.getElementById('qv-price').textContent = money(p.price) + ' CLP';
  document.getElementById('qv-desc').textContent = p.desc || '';
  document.getElementById('qv-qty-val').textContent = qvQty;

  const swWrap = document.getElementById('qv-swatches-wrap');
  if(p.swatches && p.swatches.length>1){
    swWrap.style.display='block';
    document.getElementById('qv-swatches').innerHTML = p.swatches.map((c,i)=>
      `<button class="qv-swatch ${i===qvSwatchIdx?'selected':''}" style="background:${c}" onclick="selectQvSwatch(${i})"></button>`
    ).join('');
  } else {
    swWrap.style.display='none';
  }

  renderQvGallery(p);
  renderQvRecommend(p);

  const modal = document.querySelector('.qv-modal');
  if(modal) modal.scrollTop = 0;
}

/* ---- Galería de fotos adicionales (solo aparece si el producto tiene más de 1 imagen) ---- */
function selectQvGalleryImg(src){
  document.getElementById('qv-img').src = src;
  document.querySelectorAll('.qv-gallery-thumb').forEach(t=>t.classList.toggle('active', t.dataset.src===src));
}
function renderQvGallery(p){
  const wrap = document.getElementById('qv-gallery-wrap');
  if(!wrap) return;
  const extra = (p.images && p.images.length) ? p.images : [];
  const allImgs = [p.img, ...extra.filter(i=>i!==p.img)];
  if(allImgs.length<2){ wrap.style.display='none'; wrap.innerHTML=''; return; }
  wrap.style.display='flex';
  wrap.innerHTML = allImgs.map((src,i)=>
    `<button class="qv-gallery-thumb ${i===0?'active':''}" data-src="${src}" onclick="selectQvGalleryImg('${src}')">
      <img src="${src}" alt="${p.name} foto ${i+1}">
    </button>`).join('');
}

/* ---- Te puede interesar: 4 productos relacionados (misma categoría, sin repetir el actual) ---- */
function getRelatedProducts(p){
  const sameCat = PRODUCTS.filter(x=>x.cat===p.cat && x.id!==p.id);
  let picks = [...sameCat];
  if(picks.length<4){
    // completa con categorías afines (nunca con categorías sin relación)
    const affinity = (CATEGORY_GROUPS[p.cat] || [p.cat]).filter(c=>c!==p.cat);
    for(const cat of affinity){
      if(picks.length>=4) break;
      const more = PRODUCTS.filter(x=>x.cat===cat && x.id!==p.id && !picks.includes(x));
      picks = picks.concat(more.slice(0, 4-picks.length));
    }
  }
  return picks.slice(0,4);
}
function renderQvRecommend(p){
  const wrap = document.getElementById('qv-recommend-wrap');
  const grid = document.getElementById('qv-recommend-grid');
  if(!wrap || !grid) return;
  const related = getRelatedProducts(p);
  if(!related.length){ wrap.style.display='none'; return; }
  wrap.style.display='block';
  grid.innerHTML = related.map(r=>`
    <button class="qv-rec-card" onclick="swapQuickView(${r.id})">
      <div class="qv-rec-img"><img src="${r.img}" alt="${r.name}" loading="lazy"></div>
      <div class="qv-rec-name">${r.name}</div>
      <div class="qv-rec-price">${money(r.price)} CLP</div>
    </button>`).join('');
}
/* Reemplaza el producto mostrado en el mismo recuadro, sin cerrar el modal */
function swapQuickView(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  qvProduct = p;
  qvSwatchIdx = 0;
  qvQty = 1;
  renderQuickView();
}
function selectQvSwatch(i){ qvSwatchIdx = i; renderQuickView(); }
function qvChangeQty(d){ qvQty = Math.max(1, qvQty+d); renderQuickView(); }
function qvAddToCart(){
  if(!qvProduct) return;
  addToCart(qvProduct.id, qvQty);
  closeQuickView();
}
function qvWhatsApp(){
  if(!qvProduct) return;
  const p = qvProduct;
  const color = p.swatches && p.swatches.length>1 ? ' (color seleccionado)' : '';
  const msg = `¡Hola Isterra! Me interesa: ${p.name}${color} — ${money(p.price)} CLP. ¿Está disponible?`;
  window.open('https://wa.me/56966174927?text='+encodeURIComponent(msg), '_blank');
}

/* ============ CARRITO ============ */
function addToCart(id, qty){
  qty = qty || 1;
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.qty += qty;
  else cart.push({...p, qty});
  updateCartUI();
  openCart();
  showToast(p.name + ' agregado al carrito');
}
function changeQty(id, d){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += d;
  if(item.qty<=0) cart = cart.filter(x=>x.id!==id);
  updateCartUI();
}
function removeFromCart(id){ cart = cart.filter(x=>x.id!==id); updateCartUI(); }

function updateCartUI(){
  const count = cart.reduce((a,b)=>a+b.qty,0);
  const badge = document.getElementById('cart-count');
  if(badge) badge.textContent = count;
  const list = document.getElementById('cart-items-list');
  if(!list) return;
  if(!cart.length){
    list.innerHTML = '<div class="empty-cart">Tu carrito está vacío.<br><br>Elige algo que te encante ✨</div>';
    document.getElementById('cart-total').textContent = '$0';
    return;
  }
  list.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <div class="cart-item-img"><img src="${i.img}" alt="${i.name}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-variant">${i.variant}</div>
        <div class="cart-item-price">${money(i.price)} c/u</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
          <span class="qty-val">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i.id})">✕</button>
    </div>`).join('');
  const sub = cart.reduce((a,b)=>a+b.price*b.qty,0);
  const total = sub * (1 - currentDiscount/100);
  document.getElementById('cart-total').textContent = money(Math.round(total)) + ' CLP';
}
function openCart(){ document.getElementById('cart-overlay').classList.add('open'); updateCartUI(); }
function closeCart(){ document.getElementById('cart-overlay').classList.remove('open'); }
function closeCartOutside(e){ if(e.target.id==='cart-overlay') closeCart(); }

function applyCartCoupon(){
  const code = document.getElementById('cart-coupon').value.trim().toUpperCase();
  const msg = document.getElementById('cart-discount-msg');
  if(COUPONS[code]){
    currentDiscount = COUPONS[code];
    msg.innerHTML = `<div class="discount-msg">✓ Descuento ${currentDiscount}% aplicado</div>`;
    updateCartUI();
  } else {
    msg.innerHTML = '<div style="color:#C62828;font-size:12px;margin-bottom:8px;">Código no válido</div>';
  }
}
function applyCouponMain(){
  const code = document.getElementById('coupon-main').value.trim().toUpperCase();
  const msg = document.getElementById('coupon-msg-main');
  if(COUPONS[code]){
    currentDiscount = COUPONS[code];
    msg.innerHTML = `<span style="color:#F7F0DC;">✓ Código <strong>${code}</strong> activado — ${COUPONS[code]}% de descuento</span>`;
    showToast('Cupón '+code+': '+COUPONS[code]+'% OFF');
  } else {
    msg.innerHTML = '<span style="color:#FFD2D2;">Código no válido. Prueba ISTERRA10 o AMOR15</span>';
  }
}
function checkout(){
  if(!cart.length){ showToast('Tu carrito está vacío'); return; }
  const sub = cart.reduce((a,b)=>a+b.price*b.qty,0);
  const total = Math.round(sub * (1 - currentDiscount/100));
  const items = cart.map(i=>'• '+i.name+' x'+i.qty+' — '+money(i.price*i.qty)+' CLP').join('\n');
  const disc = currentDiscount ? '\n🏷️ Descuento: '+currentDiscount+'%' : '';
  const msg = `¡Hola Isterra! Quiero hacer un encargo:\n\n${items}${disc}\n\n💰 *Total estimado: ${money(total)} CLP*\n\n¿Me confirmas disponibilidad y tallas? ¡Gracias! 🪡`;
  window.open('https://wa.me/56966174927?text='+encodeURIComponent(msg), '_blank');
}

/* ============ CONTACTO ============ */
function submitContact(){
  const n = document.getElementById('c-name').value.trim();
  const e = document.getElementById('c-email').value.trim();
  const t = document.getElementById('c-msg').value.trim();
  const msg = document.getElementById('contact-msg');
  if(!n || !e || !t){
    msg.innerHTML = '<span style="color:#C62828">Completa todos los campos.</span>';
    return;
  }
  msg.innerHTML = '<span style="color:#2E7D32">✓ Mensaje recibido. Te responderemos pronto.</span>';
  document.getElementById('c-name').value='';
  document.getElementById('c-email').value='';
  document.getElementById('c-msg').value='';
  showToast('Mensaje enviado ✓');
}
function submitNewsletter(){
  const input = document.getElementById('newsletter-email');
  const msg = document.getElementById('newsletter-msg');
  const val = input.value.trim();
  if(!val || !val.includes('@')){
    msg.innerHTML = '<span style="color:#FFD2D2">Ingresa un correo válido.</span>';
    return;
  }
  msg.innerHTML = '<span style="color:#F7F0DC">✓ ¡Gracias por suscribirte!</span>';
  input.value='';
}

/* ============ SMOOTH SCROLL (implementación propia, robusta) ============ */
function smoothScrollToY(targetY, duration=650){
  const startY = window.scrollY || document.documentElement.scrollTop;
  const diff = targetY - startY;
  const startTime = performance.now();
  function easeInOutQuad(t){ return t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }
  function step(now){
    const elapsed = now - startTime;
    const progress = Math.min(elapsed/duration, 1);
    const y = startY + diff * easeInOutQuad(progress);
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
    if(progress < 1){ requestAnimationFrame(step); }
  }
  requestAnimationFrame(step);
}
function smoothScrollToEl(id, offset=110){
  const el = document.getElementById(id);
  if(!el) return;
  const rect = el.getBoundingClientRect();
  const targetY = rect.top + (window.scrollY || document.documentElement.scrollTop) - offset;
  smoothScrollToY(Math.max(targetY,0));
}

/* ============ MEGA MENU ============ */
function toggleMegaMenu(force){
  const menu = document.getElementById('mega-menu');
  if(!menu) return;
  document.getElementById('about-menu')?.classList.remove('open');
  if(force===false){ menu.classList.remove('open'); return; }
  if(force===true){ menu.classList.add('open'); return; }
  menu.classList.toggle('open');
}

/* ============ ABOUT MENU (Quiénes somos) ============ */
function toggleAboutMenu(force){
  const menu = document.getElementById('about-menu');
  if(!menu) return;
  document.getElementById('mega-menu')?.classList.remove('open');
  if(force===false){ menu.classList.remove('open'); return; }
  if(force===true){ menu.classList.add('open'); return; }
  menu.classList.toggle('open');
}

/* ============ BÚSQUEDA ============ */
function openSearch(){
  document.getElementById('search-panel').classList.add('open');
  document.getElementById('search-input').focus();
  renderSearchResults('');
}
function closeSearch(){ document.getElementById('search-panel').classList.remove('open'); }
function closeSearchOutside(e){ if(e.target.id==='search-panel') closeSearch(); }
function renderSearchResults(q){
  const wrap = document.getElementById('search-results');
  const query = q.trim().toLowerCase();
  const list = query ? PRODUCTS.filter(p=>p.name.toLowerCase().includes(query)||p.cat.includes(query)) : PRODUCTS;
  if(!list.length){
    wrap.innerHTML = '<div class="search-empty">No encontramos resultados para tu búsqueda.</div>';
    return;
  }
  wrap.innerHTML = list.slice(0,8).map(p=>`
    <a class="search-result-item" onclick="closeSearch();openQuickView(${p.id});return false;" href="#">
      <img src="${p.img}" alt="${p.name}">
      <div>
        <div class="search-result-name">${p.name}</div>
        <div class="search-result-price">${money(p.price)} CLP</div>
      </div>
    </a>`).join('');
}

/* ============ SCROLL UTILS ============ */
function scrollTo(id){ smoothScrollToEl(id); }
function showToast(m){
  const t = document.getElementById('toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}

/* ============ HERO SLIDESHOW ============ */
let heroIdx = 0;
let heroTimer = null;
function initHeroSlideshow(){
  const wrap = document.getElementById('hero-slides');
  const dotsWrap = document.getElementById('hero-dots');
  if(!wrap) return;
  wrap.innerHTML = HERO_SLIDES.map((src,i)=>`<div class="hero-slide ${i===0?'active':''}"><img src="${src}" alt="Isterra tejido a mano" loading="${i===0?'eager':'lazy'}"></div>`).join('');
  if(dotsWrap) dotsWrap.innerHTML = HERO_SLIDES.map((_,i)=>`<span class="hero-dot ${i===0?'active':''}" data-i="${i}"></span>`).join('');
  startHeroTimer();
}
function startHeroTimer(){
  if(heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(()=>{ heroGo(heroIdx+1); }, 4800);
}
function heroGo(newIdx){
  const wrap = document.getElementById('hero-slides');
  const dotsWrap = document.getElementById('hero-dots');
  if(!wrap) return;
  const slides = wrap.querySelectorAll('.hero-slide');
  const dots = dotsWrap ? dotsWrap.querySelectorAll('.hero-dot') : [];
  if(!slides.length) return;
  slides[heroIdx].classList.remove('active');
  if(dots[heroIdx]) dots[heroIdx].classList.remove('active');
  heroIdx = (newIdx + slides.length) % slides.length;
  slides[heroIdx].classList.add('active');
  if(dots[heroIdx]) dots[heroIdx].classList.add('active');
}
function heroNext(){ heroGo(heroIdx+1); startHeroTimer(); }
function heroPrev(){ heroGo(heroIdx-1); startHeroTimer(); }

/* ============ ROTADORES AUTOMÁTICOS DE LAS SECCIONES DE MARCA ============
   Usados en "Hecho a mano, hilo a hilo" y "Tejido por encargo, nunca en
   serie". Cambian de foto solas cada cierto tiempo, sin flechas. */
function initLifeRotator(containerId, images){
  const wrap = document.getElementById(containerId);
  if(!wrap || !images || images.length<2) return;
  wrap.innerHTML = images.map((src,i)=>`<div class="life-rot-slide ${i===0?'active':''}"><img src="${src}" alt="Isterra"></div>`).join('');
  let idx = 0;
  setInterval(()=>{
    const slides = wrap.querySelectorAll('.life-rot-slide');
    slides[idx].classList.remove('active');
    idx = (idx+1) % slides.length;
    slides[idx].classList.add('active');
  }, 3600);
}

/* ============ HEADER SOLID ON SCROLL (overlay transparente sobre el hero) ============ */
function updateHeaderState(){
  const header = document.getElementById('site-header');
  if(!header) return;
  if(window.scrollY > 140){
    header.classList.add('solid');
  } else {
    header.classList.remove('solid');
  }
}

/* ============ BACK TO TOP + SCROLL REVEAL ============ */
window.addEventListener('scroll', ()=>{
  const btn = document.getElementById('back-top');
  if(btn) btn.classList.toggle('show', window.scrollY > 480);
  updateHeaderState();
});
window.addEventListener('resize', updateHeaderState);
function initScrollReveal(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  }, {threshold:0.12});
  els.forEach(el=>obs.observe(el));
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', ()=>{
  initHeroSlideshow();
  renderCatAccordion();
  renderCategories();
  renderIG();
  renderReviews();
  initScrollReveal();
  updateHeaderState();
  initLifeRotator('life-rotator-hecho-a-mano', LIFE_ROTATOR_HECHO_A_MANO);
  initLifeRotator('life-rotator-tejido-encargo', LIFE_ROTATOR_TEJIDO_ENCARGO);

  document.addEventListener('click', (e)=>{
    const megaTrigger = document.getElementById('mega-trigger');
    const megaMenu = document.getElementById('mega-menu');
    if(megaMenu && megaTrigger && !megaTrigger.contains(e.target) && !megaMenu.contains(e.target)){
      megaMenu.classList.remove('open');
    }
    const aboutTrigger = document.getElementById('about-trigger');
    const aboutMenu = document.getElementById('about-menu');
    if(aboutMenu && aboutTrigger && !aboutTrigger.contains(e.target) && !aboutMenu.contains(e.target)){
      aboutMenu.classList.remove('open');
    }
  });

  const searchInput = document.getElementById('search-input');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>renderSearchResults(e.target.value));
  }
});
