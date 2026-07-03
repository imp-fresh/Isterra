/* ======================================================================
   ISTERRA · ARCHIVO DE DATOS DEL CATÁLOGO
   ======================================================================
   Este es el ÚNICO archivo que necesitas editar para:
   - Agregar, quitar o modificar productos
   - Cambiar precios o nombres
   - Agregar categorías nuevas
   - Cambiar las fotos de portada o de las secciones "Hecho a mano" /
     "Tejido por encargo"

   REGLA DE FOTOS: cualquier foto que agregues debe guardarse dentro de
   /img/catalog/<categoria>/ con un nombre simple sin espacios ni tildes
   (ej: mi-producto-nuevo.jpg). Si la foto viene de un iPhone y se ve
   "acostada" en tu computador, avísame para procesarla — el sitio
   necesita que la imagen ya venga con su orientación corregida (esto se
   hace una sola vez al subir la foto).

   Para agregar un producto nuevo: copia un bloque { ... } completo,
   pégalo donde quieras dentro de PRODUCTS, y cambia sus datos.
   El "id" debe ser un número que no se repita.
   ====================================================================== */

/* ---------- CATEGORÍAS ----------
   key   = identificador interno (no cambiar sin avisar)
   label = nombre que ve el cliente
   sub   = frase corta bajo el nombre en el bloque de categoría
------------------------------------------------------------------------ */
const CATEGORIES = [
  {key:'todos',     label:'Todos',     sub:'Toda la colección'},
  {key:'tops',      label:'Tops',      sub:'Tejido a crochet'},
  {key:'sombreros', label:'Sombreros', sub:'Bordado a mano'},
  {key:'bolsos',    label:'Bolsos',    sub:'Piezas únicas'},
  {key:'chalecos',  label:'Chalecos',  sub:'Tejido a palillos'},
  {key:'hogar',     label:'Hogar',     sub:'Fibras naturales'},
  {key:'blusones',  label:'Blusones',  sub:'Piezas statement'},
  {key:'capuchas',  label:'Capuchas',  sub:'Abrigo tejido'},
  {key:'gorros',    label:'Gorros',    sub:'Para cada estación'},
  {key:'mitones',   label:'Mitones',   sub:'Calor artesanal'},
];

/* ---------- PRODUCTOS ----------
   id       = número único
   name     = nombre visible
   cat      = debe coincidir con un "key" de CATEGORIES
   price    = número sin puntos ni signo $ (ej: 28990)
   variant  = descripción corta bajo el nombre (color / material)
   badge    = 'best' | 'popular' | 'new' | 'classic' | '' (sin badge)
   img      = foto principal
   images   = [opcional] lista de fotos adicionales (otros ángulos,
              puesto, otros colores). Si no existen, se puede omitir
              o dejar como [] — el recuadro de "más fotos" no aparece
              si solo hay una imagen.
   swatches = colores del producto (círculos de color)
   desc     = descripción larga en el recuadro de vista rápida
------------------------------------------------------------------------ */
const PRODUCTS = [
  // ---- TOPS ----
  {id:1,  name:'Top Fantasía',      cat:'tops', price:28990, variant:'Blanco · Pompones · Hecho a mano', badge:'best', img:'img/catalog/tops/top-fantasia.jpg', images:[], swatches:['#F7F3EC'], desc:'Pieza icónica tejida a crochet con detalle de pompones en el borde. Encaje delicado y tirantes ajustables.'},
  {id:3,  name:'Tops Veraniegos',  cat:'tops', price:27000, variant:'4 colores pastel · Personalizable', badge:'new', img:'img/catalog/tops/tops-veraniegos.jpg', images:[], swatches:['#F5E6D8','#E8A9A0','#C9C0E0','#A8C3A0'], desc:'Disponible en 4 tonos pastel. Diseño con colgante de hoja tejida y amarre ajustable al cuello.'},
  {id:5,  name:'Top Clásico',      cat:'tops', price:15990, variant:'Beige · Encaje crochet · Hojas', badge:'best', img:'img/catalog/tops/top-clasico.jpg', images:[], swatches:['#E8DCC8'], desc:'Top halter en algodón natural con encaje calado y colgantes en forma de hoja. Amarre al cuello.'},
  {id:6,  name:'Top Limonada',     cat:'tops', price:15990, variant:'Naranja / Menta · Botones madera', badge:'new', img:'img/catalog/tops/top-limonada.jpg', images:[], swatches:['#E0923D','#A8C3A0'], desc:'Listo para enviar de inmediato. Tejido a crochet con botones de madera y terminación festoneada.'},
  {id:8,  name:'Halter Top Negro Malla', cat:'tops', price:30000, variant:'Negro · Malla crochet · Exclusivo', badge:'', img:'img/catalog/tops/halter-top-negro-malla.jpg', images:[], swatches:['#1A1A1A'], desc:'Top de malla abierta tejida a crochet, diseño halter exclusivo con textura de rombos.'},
  {id:12, name:'Top Relieve',      cat:'tops', price:15990, variant:'Celeste · Hojas tejidas · Delicado', badge:'', img:'img/catalog/tops/top-relieve.jpg', images:[], swatches:['#9FB8D9'], desc:'Top delicado en tono celeste con colgantes de hoja. Amarre trasero ajustable a tu medida.'},
  {id:13, name:'Top Playa',        cat:'tops', price:34990, variant:'Menta/Amarillo/Blanco · Botones', badge:'new', img:'img/catalog/tops/top-playa.jpg', images:[], swatches:['#A8C3A0','#E8C23D','#F7F3EC'], desc:'Top a rayas en tonos menta, amarillo y blanco, con botones frontales y borde de pompones.'},
  {id:15, name:'Top Estándar',     cat:'tops', price:14990, variant:'Lila / Amarillo · Margaritas', badge:'', img:'img/catalog/tops/top-estandar.jpg', images:[], swatches:['#C9C0E0','#E8C23D'], desc:'Disponible de inmediato en lila y amarillo, con detalle de margaritas bordadas.'},

  // ---- SOMBREROS ----
  {id:2,  name:'Sombrero Margaritas', cat:'sombreros', price:14990, variant:'Negro / Beige · Margaritas bordadas', badge:'popular', img:'img/catalog/sombreros/sombrero-margaritas.jpg', images:[], swatches:['#1A1A1A','#D9C9A8'], desc:'Gorro tejido a crochet con margaritas bordadas a mano. Cómodo, fresco y con mucho carácter.'},
  {id:11, name:'Sombrero Sedoso',  cat:'sombreros', price:14990, variant:'Lila · Pelo sintético suave', badge:'new', img:'img/catalog/sombreros/sombrero-sedoso.jpg', images:[], swatches:['#C9A8D9'], desc:'Sombrero de ala con textura afelpada ultra suave, en delicado tono lila. Pieza statement de temporada fría.'},
  {id:22, name:'Rocío',            cat:'sombreros', price:14990, variant:'Rosa / Gris · Tejido grueso', badge:'', img:'img/catalog/sombreros/rocio.jpg', images:[], swatches:['#E0A0B0','#B8ADA5'], desc:'Sombrero de ala tejido con hebra gruesa en mezcla rosa y gris. Abrigador y liviano a la vez.'},

  // ---- BOLSOS ----
  {id:4,  name:'Morral Hojas a la Tierra', cat:'bolsos', price:38000, variant:'Multicolor · Tejido artesanal', badge:'classic', impact:true, img:'img/catalog/bolsos/morral-hojas-tierra.jpg', images:[], swatches:['#A8C3A0','#D9C9A8','#C17B5E'], desc:'Una de nuestras piezas más queridas. Bolso tipo morral con cordón ajustable, hojas tejidas y borlas decorativas.'},
  {id:10, name:'Bolsito Circular Boho', cat:'bolsos', price:24000, variant:'Café · Flecos · Botón handmade', badge:'', img:'img/catalog/bolsos/bolsito-circular-boho.jpg', images:[], swatches:['#8B5A3C'], desc:'Bolso circular con flecos largos y botón "handmade with love". Correa cruzada ajustable.'},

  // ---- CHALECOS ----
  {id:7,  name:'Chaleco Luci',     cat:'chalecos', price:44990, variant:'Salmón · Tejido palillos · Suave', badge:'new', img:'img/catalog/chalecos/chaleco-luci.jpg', images:[], swatches:['#D98B7A'], desc:'Chaleco sin mangas tejido a palillos, textura acanalada y muy suave al tacto. Ideal sobre camisa o blusa.'},
  {id:21, name:'Chaleco Aurora',   cat:'chalecos', price:34990, variant:'Crema · Lana gruesa · Cuello camisero', badge:'new', img:'img/catalog/chalecos/chaleco-aurora.jpg', images:[], swatches:['#F2E8C8'], desc:'Chaleco tejido en lana gruesa color crema, textura acanalada y caída suelta. Combina con blusas y camisas.'},

  // ---- HOGAR ----
  {id:9,  name:'Set Spa Ecológico', cat:'hogar', price:24990, variant:'Algodón natural · Hecho a mano', badge:'', img:'img/catalog/hogar/set-spa-ecologico.jpg', images:[], swatches:['#F0E6D2'], desc:'Set de spa en algodón 100% natural: canasto, toalla, esponja y bolsita. Libre de plástico.'},
  {id:14, name:'Mural Macramé',    cat:'hogar', price:45000, variant:'Algodón natural · Rama madera', badge:'', img:'img/catalog/hogar/mural-macrame.jpg', images:[], swatches:['#F0E6D2'], desc:'Mural decorativo de macramé montado en rama de madera natural. Pieza statement para cualquier espacio.'},

  // ---- BLUSONES ----
  {id:16, name:'Blusón Bohemia',   cat:'blusones', price:90000, variant:'Crudo · Cuello camisero · Botones madera', badge:'new', img:'img/catalog/blusones/bluson-bohemia.jpg', images:[], swatches:['#F2ECD9'], desc:'Blusón tejido a crochet de manga corta, cuello camisero y botonadura completa en madera. Pieza statement de la temporada.'},

  // ---- CAPUCHAS ----
  {id:20, name:'Capucha Alpes',    cat:'capuchas', price:21990, variant:'Negro · Borde afelpado', badge:'new', img:'img/catalog/capuchas/capucha-alpes.jpg', images:[], swatches:['#1A1A1A'], desc:'Capucha-cuello tejida en punto grueso con borde interior afelpado ultra suave. Abrigo total para el invierno.'},

  // ---- GORROS ----
  {id:17, name:'Gorros Veraniegos', cat:'gorros', price:9990, variant:'Crudo / Miel / Café · Con cuentas', badge:'new', img:'img/catalog/gorros/gorros-veraniegos.jpg', images:[], swatches:['#F2ECD9','#D99A4E','#7A4B3A'], desc:'Gorros caladas tejidas a crochet con cuentas de madera en el borde. Frescos, livianos y con mucho estilo.'},
  {id:18, name:'Gorro Elástico',   cat:'gorros', price:9990, variant:'Café / Miel / Rosa · Punto elástico', badge:'', img:'img/catalog/gorros/gorro-elastico.jpg', images:[], swatches:['#7A5A2E','#E0A85E','#E8C3CC'], desc:'Gorro básico de punto elástico grueso, cómodo y abrigador. Disponible en varios colores.'},
  {id:19, name:'Gorro Espiga',     cat:'gorros', price:12990, variant:'Beige / Crudo · Con pompón de pelo', badge:'', img:'img/catalog/gorros/gorro-espiga.jpg', images:[], swatches:['#C9A876','#F2ECD9'], desc:'Gorro tejido en punto espiga con pompón de pelo sintético. Terminación premium hecha a mano.'},

  // ---- MITONES ----
  {id:23, name:'Mitones Andes',    cat:'mitones', price:11990, variant:'Gris oscuro · Borde afelpado', badge:'new', img:'img/catalog/mitones/mitones-andes.jpg', images:[], swatches:['#3A3A3A'], desc:'Mitones tejidos a palillos con borde afelpado ultra suave. Dejan los dedos libres para seguir con lo tuyo sin pasar frío.'},
];

/* ---------- FOTOS DE PORTADA (hero) ----------
   El slideshow grande de la portada. Agrega o quita rutas de foto
   libremente; se reparten automáticamente en el tiempo.
------------------------------------------------------------------------ */
const HERO_SLIDES = [
  'img/ig/ig05.jpg',
  'img/ig/ig09.jpg',
  'img/catalog/bolsos/morral-hojas-tierra.jpg',
  'img/ig/ig06.jpg',
  'img/catalog/chalecos/chaleco-luci.jpg',
];

/* ---------- GRUPOS ROTATIVOS DE LAS SECCIONES DE MARCA ----------
   Cambian de foto automáticamente (sin flechas). Agrega o quita
   rutas para variar el contenido.
------------------------------------------------------------------------ */
const LIFE_ROTATOR_HECHO_A_MANO = [
  'img/ig/ig05.jpg',
  'img/ig/ig01.jpg',
  'img/ig/ig06.jpg',
];

const LIFE_ROTATOR_TEJIDO_ENCARGO = [
  'img/process/proceso-tejido-01.jpg',
  'img/ig/ig08.jpg',
  'img/ig/ig04.jpg',
];

/* ---------- GALERÍA DE INSTAGRAM ---------- */
const IG_ITEMS = [
  {label:'Top beige botones',       img:'img/ig/ig01.jpg'},
  {label:'Top menta Isterra',       img:'img/ig/ig02.jpg'},
  {label:'Top amarillo margaritas', img:'img/ig/ig03.jpg'},
  {label:'Chaleco crema grueso',    img:'img/ig/ig04.jpg'},
  {label:'Vestido crema botones',   img:'img/ig/ig05.jpg'},
  {label:'Halter natural flatlay',  img:'img/ig/ig06.jpg'},
  {label:'Top naranja detalle',     img:'img/ig/ig07.jpg'},
  {label:'Gorro café bosque',       img:'img/ig/ig08.jpg'},
  {label:'Top terracota bosque',    img:'img/ig/ig09.jpg'},
];

/* ---------- GRUPOS DE AFINIDAD (para "Te puede interesar") ----------
   Si una categoría tiene pocos productos, las sugerencias se completan
   con categorías afines (nunca con categorías sin relación — por
   ejemplo, a alguien viendo una capucha no se le ofrecen tops). */
const CATEGORY_GROUPS = {
  tops:      ['tops','blusones','chalecos'],
  blusones:  ['blusones','tops','chalecos'],
  chalecos:  ['chalecos','tops','blusones'],
  sombreros: ['sombreros','gorros','capuchas'],
  gorros:    ['gorros','sombreros','capuchas','mitones'],
  capuchas:  ['capuchas','gorros','mitones','sombreros'],
  mitones:   ['mitones','gorros','capuchas'],
  bolsos:    ['bolsos','hogar'],
  hogar:     ['hogar','bolsos'],
};

/* ---------- CUPONES ---------- */
const COUPONS = {'ISTERRA10':10,'AMOR15':15,'ISTERRA20':20};

/* ---------- RESEÑAS ---------- */
const REVIEWS_BASE = [
  {name:'Valentina M.', product:'Top Fantasía', stars:5, text:'Compré el top y es hermoso. La calidad es increíble, cada detalle se nota hecho con amor.', date:'Diciembre 2024'},
  {name:'Sofía R.', product:'Morral Hojas a la Tierra', stars:5, text:'Mi morral de Isterra me lo preguntan en todas partes. Moda sostenible y única, no hay otra igual.', date:'Noviembre 2024'},
  {name:'Camila A.', product:'Tops Veraniegos', stars:4, text:'El top que pedí quedó hermoso y el color exacto al de la foto. Vale cada día de espera.', date:'Octubre 2024'},
];
