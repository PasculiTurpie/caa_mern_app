# CAA MERN App — Comunicador Aumentativo y Alternativo

Aplicación web accesible de Comunicación Aumentativa y Alternativa (CAA/AAC)
para personas con dificultades de habla y movilidad reducida, construida con
el stack MERN (MongoDB, Express, React, Node.js).

## Características

- **Clave Fitzgerald**: colores de tarjeta por categoría gramatical (sujeto,
  acción, objeto, urgencia, emoción, lugar).
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
- **Temas**: claro, oscuro y alto contraste.

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
