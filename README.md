# CAA MERN App — Comunicador Aumentativo y Alternativo

Aplicación web accesible de Comunicación Aumentativa y Alternativa (CAA/AAC)
para personas con dificultades de habla y movilidad reducida, construida con
el stack MERN (MongoDB, Express, React, Node.js).

## Características

- **Clave Fitzgerald**: colores de tarjeta por categoría gramatical/funcional
  (sujeto, acción, objeto, urgencia, emoción, lugar, social/cortesía, frases
  chistosas y conectores/artículos).
- **Escaneo secuencial (Switch Access)**: resalta automáticamente cada
  tarjeta; selección con un pulsador (tecla Espacio o Enter).
- **Tiempo de morada (Dwell Time)**: selección al mantener el puntero/mirada
  sobre una tarjeta, con indicador circular de progreso — pensado para
  eye-tracking.
- **Síntesis de voz (Web Speech API)**: lectura de cada tarjeta al
  seleccionarla y de la frase completa armada, con control de velocidad,
  tono y voz.
- **Autenticación JWT** con preferencias de accesibilidad persistidas por
  usuario (velocidad de escaneo, tiempo de dwell, tema, voz).
- **Equipo de cuidado (paciente / tutor / terapeuta)**: sistema de vínculo
  por código de invitación que conecta las cuentas y determina qué tarjetas
  privadas puede ver cada quién, y quién puede editarlas/eliminarlas.
- **Temas**: claro, oscuro y alto contraste.

## Cómo se relacionan los roles paciente / tutor / terapeuta

Antes de este cambio no existía ningún vínculo real entre cuentas: "pública"
significaba visible para *cualquier* usuario de la app, y no había forma de
decir "esta terapeuta atiende a este paciente". Esto ya está resuelto así:

1. **Vinculación por código**: cualquier usuario (paciente, tutor o
   terapeuta) puede generar un código de invitación temporal (válido 24h)
   desde el botón "Equipo de cuidado" (ícono de personas en el header). Otro
   usuario ingresa ese código para vincularse. El vínculo es bidireccional:
   ambos quedan en el `linkedUsers` del otro.
   - Una terapeuta puede repetir este proceso con varios tutores/pacientes:
     no hay límite de vínculos, así que sí puede atender a varias personas.
   - Un paciente puede estar vinculado a varios tutores y/o terapeutas a la vez.

2. **Visibilidad de tarjetas** (`GET /api/cards`): un usuario ve sus propias
   tarjetas, las marcadas como `isPublic: true` (biblioteca general, como las
   tarjetas predefinidas del seed) y **las de cualquier persona vinculada a
   él**, sean públicas o privadas. Así, si la terapeuta crea una tarjeta
   privada para practicar algo puntual con su paciente, ese paciente (una vez
   vinculado) la ve en su tablero aunque no sea pública.

3. **Permisos de edición/eliminación** (`PUT`/`DELETE /api/cards/:id`):
   - El creador de una tarjeta siempre puede editarla/eliminarla.
   - **Un paciente nunca puede editar ni eliminar tarjetas que no creó él
     mismo** (aunque las vea porque su tutor/terapeuta se las compartió).
   - Un tutor o terapeuta sí puede editar/eliminar tarjetas creadas por
     cualquier persona de su equipo vinculado (su paciente, u otro
     profesional vinculado al mismo paciente).

Esta regla vive en `backend/src/controllers/cardController.js`
(función `canManageCard`) y se refleja en la interfaz: los botones de
editar/eliminar solo aparecen cuando el usuario realmente tiene permiso.

## Estructura del proyecto

```
caa-mern-app/
├── backend/    → API REST (Node.js + Express + MongoDB/Mongoose)
└── frontend/   → SPA (React + Vite + Tailwind CSS)
```

## Puesta en marcha

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edita MONGO_URI y JWT_SECRET
npm run dev             # http://localhost:5000
```

Requiere una instancia de MongoDB corriendo localmente o una cadena de
conexión de MongoDB Atlas en `MONGO_URI`.

#### Tarjetas predefinidas (seed)

Para no partir de cero, el backend incluye un set de tarjetas prediseñadas
que cubren las 8 categorías (incluyendo "Social/Cortesía" y "Frases
chistosas"). Para cargarlas en la base de datos:

```bash
cd backend
npm run seed
```

El script crea un usuario "Sistema CAA" que actúa como propietario de estas
tarjetas públicas, y puede ejecutarse varias veces sin duplicar datos.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

Por defecto el frontend llama a `http://localhost:5000/api`. Para cambiarlo,
crea un archivo `.env` en `frontend/` con:

```
VITE_API_URL=http://localhost:5000/api
```

## Flujo de uso

1. Regístrate o inicia sesión desde `/login`.
2. En la pantalla principal, toca tarjetas para construir una frase en la
   barra superior (`PhraseBar`).
3. Pulsa **Hablar** para escuchar la frase completa.
4. Usa **Ajustes** (icono de engranaje) para activar el escaneo secuencial,
   el tiempo de morada, o cambiar la voz/tema.
5. Usa **Añadir tarjeta** (icono +) para crear tarjetas personalizadas.

## Notas sobre integración con IA (expansión de frases)

El componente `PhraseBar` acepta una prop opcional `onExpandWithAI` que,
si se provee desde `CommunicatorPage`, puede conectarse a un servicio backend
(o directamente a una API de LLM) para expandir la secuencia de tarjetas en
una frase gramaticalmente completa. Esto se dejó como punto de extensión
para no forzar una dependencia obligatoria de un proveedor de IA externo.

## Notas de accesibilidad implementadas

- Foco de teclado visible reforzado (`:focus-visible`) en toda la app.
- `aria-live`, `role="status"`, `role="dialog"` y `aria-label` en los
  elementos interactivos y dinámicos.
- Soporte para `prefers-reduced-motion`.
- Tema de alto contraste dedicado.
