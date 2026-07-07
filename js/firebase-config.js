/* ======================================================================
   ISTERRA · CONEXIÓN A LA BASE DE DATOS DE RESEÑAS (Firebase Firestore)
   ======================================================================
   Este archivo conecta las reseñas del sitio a una base de datos
   compartida real: cuando alguien deja una reseña, TODOS los
   visitantes la ven (no solo la persona que la escribió).

   Mientras no completes los pasos de abajo, el sitio funciona igual
   que antes (las reseñas de ejemplo se ven bien), simplemente no se
   guardan nuevas reseñas de forma compartida todavía.

   PASOS PARA ACTIVARLO (una sola vez):

   1. Ve a https://console.firebase.google.com y entra con tu cuenta
      de Gmail (puede ser la misma de isterraventas@gmail.com).

   2. Clic en "Agregar proyecto" → nómbralo "isterra" → sigue los
      pasos (puedes desactivar Google Analytics, no hace falta).

   3. Dentro del proyecto, en el menú izquierdo: Compilación (Build)
      → Firestore Database → "Crear base de datos" → elige la
      ubicación más cercana (ej. "southamerica-east1") → modo
      "producción".

   4. Ve a la pestaña "Reglas" de Firestore y reemplaza todo el texto
      por esto (permite que cualquiera LEA las reseñas, y que
      cualquiera CREE una reseña nueva, pero nadie pueda editar ni
      borrar las de otras personas):

        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /reviews/{reviewId} {
              allow read: if true;
              allow create: if request.resource.data.name is string
                            && request.resource.data.text is string
                            && request.resource.data.stars is int
                            && request.resource.data.stars >= 1
                            && request.resource.data.stars <= 5;
              allow update, delete: if false;
            }
          }
        }

      Clic en "Publicar".

   5. Ve a el ícono de engranaje (arriba a la izquierda) →
      "Configuración del proyecto" → baja hasta "Tus apps" → clic en
      el ícono </> (Web) → dale un nombre (ej. "isterra-web") →
      "Registrar app". Ahí te va a mostrar un bloque de código con
      unos valores (apiKey, authDomain, projectId, etc.) — cópialos.

   6. Pega esos valores reemplazando los "..." de abajo, en
      FIREBASE_CONFIG, y listo — no necesitas tocar nada más.
   ====================================================================== */

const FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

const FIREBASE_READY = FIREBASE_CONFIG.apiKey !== "...";

let db = null;
if(FIREBASE_READY){
  try{
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
  } catch(err){
    console.warn('No se pudo inicializar Firebase:', err);
  }
}
