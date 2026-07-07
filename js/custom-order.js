/* ======================================================================
   ISTERRA · FORMULARIO DE PEDIDO PERSONALIZADO
   ======================================================================
   Modal tipo "una pregunta a la vez". Al terminar, arma un mensaje de
   WhatsApp con todas las respuestas y lo abre listo para enviar.

   Para agregar, quitar o reordenar preguntas: edita el array CO_STEPS
   más abajo. Cada pregunta es un objeto con:
     key         identificador (se usa para armar el mensaje final)
     section     texto pequeño arriba de la pregunta (agrupa temas)
     question    la pregunta en sí
     type        'text' | 'textarea' | 'choice'
     placeholder texto de ejemplo dentro del campo (solo text/textarea)
     optional    true si se puede dejar en blanco
     options     lista de opciones (solo choice)
     otherOptionLabel  si una opción de la lista debe abrir un campo de
                       texto adicional al seleccionarla (ej. "Otro")
     otherPlaceholder  texto de ejemplo de ese campo adicional
   ====================================================================== */

const CO_STEPS = [
  {key:'nombre', section:'Información de contacto', question:'¿Cuál es tu nombre?', type:'text', placeholder:'Tu nombre completo'},
  {key:'comuna', section:'Información de contacto', question:'¿En qué comuna estás?', type:'text', placeholder:'Ej: Coñaripe, Providencia...'},
  {key:'direccion', section:'Información de contacto', question:'¿Cuál es tu dirección?', type:'text', placeholder:'Solo si deseas envío a domicilio', optional:true},

  {key:'necesidad', section:'¿Qué necesitas?', question:'Cuéntanos qué te gustaría crear', type:'choice',
    options:['Quiero una prenda de la colección Isterra','Quiero un diseño personalizado de Isterra','Quiero confeccionar un diseño externo (enviaré una referencia)','Necesito ayuda con ideas para un(a)'],
    otherOptionLabel:'Necesito ayuda con ideas para un(a)', otherPlaceholder:'Cuéntanos para qué ocasión o idea (ej: matrimonio, regalo, uso diario...)'},

  {key:'tipo_prenda', section:'Cuéntanos sobre tu proyecto', question:'¿Qué tipo de prenda deseas?', type:'choice',
    options:['Top','Vestido','Sweater','Cardigan','Chaleco','Falda','Gorro','Bolso','Accesorio','Otro'],
    otherOptionLabel:'Otro', otherPlaceholder:'Cuéntanos qué tipo de prenda'},

  {key:'talla', section:'Cuéntanos sobre tu proyecto', question:'¿Qué talla necesitas?', type:'choice',
    options:['XS','S','M','L','XL','XXL','No lo sé (necesito ayuda)']},

  {key:'color', section:'Cuéntanos sobre tu proyecto', question:'¿Qué color o colores te gustaría?', type:'text', placeholder:'Ej: Terracota, tonos tierra...'},

  {key:'material', section:'Cuéntanos sobre tu proyecto', question:'¿Qué material prefieres?', type:'choice',
    options:['Algodón','Lana','Alpaca','Mohair','Sin preferencia','Otro'],
    otherOptionLabel:'Otro', otherPlaceholder:'Cuéntanos qué material'},

  {key:'comentarios', section:'Ya casi terminamos', question:'¿Algo más que quieras contarnos?', type:'textarea', placeholder:'Comentarios adicionales (opcional)', optional:true},
];

let coStepIndex = 0;
let coAnswers = {};

function openCustomOrderForm(){
  coStepIndex = 0;
  coAnswers = {};
  document.getElementById('custom-order-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCoStep();
}
function closeCustomOrderForm(){
  document.getElementById('custom-order-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function coRenderDots(){
  return CO_STEPS.map((_,i)=>{
    const cls = i===coStepIndex ? 'active' : (i<coStepIndex ? 'done' : '');
    return `<span class="co-dot ${cls}"></span>`;
  }).join('');
}

function renderCoStep(){
  const total = CO_STEPS.length;
  const bar = document.getElementById('co-progress-bar');
  bar.style.width = Math.min(100, (coStepIndex/total)*100) + '%';

  if(coStepIndex >= total){ renderCoFinalStep(); return; }

  const step = CO_STEPS[coStepIndex];
  const savedVal = coAnswers[step.key] || '';
  const body = document.getElementById('co-body');
  let inputHtml = '';

  if(step.type==='text'){
    inputHtml = `<input type="text" class="co-input" id="co-field" placeholder="${step.placeholder||''}" value="${(savedVal+'').replace(/"/g,'&quot;')}">`;
  } else if(step.type==='textarea'){
    inputHtml = `<textarea class="co-textarea" id="co-field" placeholder="${step.placeholder||''}">${savedVal}</textarea>`;
  } else if(step.type==='choice'){
    inputHtml = `<div class="co-options">` + step.options.map(opt=>{
      const sel = savedVal===opt ? 'selected' : '';
      const optAttr = JSON.stringify(opt).replace(/'/g, '&#39;');
      return `<button type="button" class="co-option ${sel}" onclick='coSelectOption(${optAttr})'>${opt}</button>`;
    }).join('') + `</div>`;
    if(step.otherOptionLabel && savedVal===step.otherOptionLabel){
      const otherVal = coAnswers[step.key+'_detalle'] || '';
      inputHtml += `<input type="text" class="co-input" id="co-other-field" style="margin-top:14px" placeholder="${step.otherPlaceholder||''}" value="${(otherVal+'').replace(/"/g,'&quot;')}">`;
    }
  }

  body.innerHTML = `
    <div class="co-section-label">${step.section}</div>
    <div class="co-question">${step.question}</div>
    ${inputHtml}
    ${step.optional ? '<div class="co-optional-note">Este paso es opcional, puedes continuar sin responder</div>' : ''}
    <div class="co-nav">
      <button class="co-nav-btn co-prev" onclick="coPrev()" ${coStepIndex===0 ? 'disabled' : ''}><i class="ti ti-chevron-left"></i></button>
      <div class="co-dots">${coRenderDots()}</div>
      <button class="co-nav-btn co-next" onclick="coNext()">${coStepIndex===total-1 ? 'Continuar' : 'Siguiente'} <i class="ti ti-chevron-right"></i></button>
    </div>
  `;

  const field = document.getElementById('co-field');
  if(field){
    field.focus();
    field.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' && step.type!=='textarea'){ e.preventDefault(); coNext(); }
    });
  }
}

function coSelectOption(opt){
  const step = CO_STEPS[coStepIndex];
  coAnswers[step.key] = opt;
  if(step.otherOptionLabel && opt===step.otherOptionLabel){
    renderCoStep(); // revela el campo adicional, sin avanzar todavía
  } else {
    renderCoStep(); // muestra la selección marcada un instante
    setTimeout(()=>{ coNext(); }, 200);
  }
}

function coNext(){
  const step = CO_STEPS[coStepIndex];
  if(step){
    if(step.type==='text' || step.type==='textarea'){
      const field = document.getElementById('co-field');
      const val = field ? field.value.trim() : '';
      if(!val && !step.optional){
        showToast('Por favor completa este campo para continuar');
        return;
      }
      coAnswers[step.key] = val;
    } else if(step.type==='choice'){
      if(!coAnswers[step.key] && !step.optional){
        showToast('Selecciona una opción para continuar');
        return;
      }
      if(step.otherOptionLabel && coAnswers[step.key]===step.otherOptionLabel){
        const otherField = document.getElementById('co-other-field');
        const otherVal = otherField ? otherField.value.trim() : '';
        if(!otherVal){
          showToast('Cuéntanos un poco más para continuar');
          return;
        }
        coAnswers[step.key+'_detalle'] = otherVal;
      }
    }
  }
  coStepIndex++;
  renderCoStep();
}

function coPrev(){
  if(coStepIndex>0){ coStepIndex--; renderCoStep(); }
}

function renderCoFinalStep(){
  const body = document.getElementById('co-body');
  const nombre = coAnswers.nombre ? coAnswers.nombre.split(' ')[0] : '';
  body.innerHTML = `
    <div class="co-final">
      <div class="co-final-icon"><i class="ti ti-sparkles"></i></div>
      <div class="co-final-title">¡Listo${nombre ? ', ' + nombre : ''}! 🎉</div>
      <p class="co-final-text">Completaste todo lo que necesitamos para empezar a darle vida a tu prenda. Solo falta un paso: envíanos tus respuestas por WhatsApp y muy pronto te escribiremos para afinar los últimos detalles junto a ti.</p>
      <button class="hero-cta" style="width:100%;background:#25D366;color:white;" onclick="submitCustomOrder()"><i class="ti ti-brand-whatsapp"></i> Continuar por WhatsApp</button>
    </div>
    <div class="co-nav" style="justify-content:flex-start;margin-top:18px;">
      <button class="co-nav-btn co-prev" onclick="coPrev()"><i class="ti ti-chevron-left"></i></button>
    </div>
  `;
}

function submitCustomOrder(){
  const a = coAnswers;
  let msg = `¡Hola! Quiero hacer un pedido personalizado en Isterra 🧶\n\n`;
  msg += `*Nombre:* ${a.nombre || '-'}\n`;
  msg += `*Comuna:* ${a.comuna || '-'}\n`;
  if(a.direccion) msg += `*Dirección:* ${a.direccion}\n`;
  msg += `\n*¿Qué necesita?* ${a.necesidad || '-'}`;
  if(a.necesidad_detalle) msg += ` (${a.necesidad_detalle})`;
  msg += `\n*Tipo de prenda:* ${a.tipo_prenda || '-'}`;
  if(a.tipo_prenda_detalle) msg += ` (${a.tipo_prenda_detalle})`;
  msg += `\n*Talla:* ${a.talla || '-'}`;
  msg += `\n*Color(es):* ${a.color || '-'}`;
  msg += `\n*Material:* ${a.material || '-'}`;
  if(a.material_detalle) msg += ` (${a.material_detalle})`;
  if(a.comentarios) msg += `\n\n*Comentarios:* ${a.comentarios}`;

  window.open('https://wa.me/56966174927?text='+encodeURIComponent(msg), '_blank');
  closeCustomOrderForm();
}
