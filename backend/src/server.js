import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

// Cabeceras de seguridad HTTP básicas (X-Content-Type-Options,
// X-Frame-Options, quita X-Powered-By, etc.). No hay contenido servido
// desde este backend que necesite relajar la CSP por defecto de helmet.
app.use(helmet());

// Límite de intentos de login/registro por IP, para mitigar fuerza bruta
// sobre credenciales. Se aplica solo a /api/auth (no al resto de la API,
// que ya requiere JWT válido vía `protect`).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // 20 intentos por IP en la ventana, suficiente para uso normal
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos, intenta de nuevo más tarde' },
});

// CORS: permite peticiones desde el/los frontend(s) configurados.
// CLIENT_URL admite varias URLs separadas por coma (ej. la URL de
// producción de Vercel + una URL de deploy específico), y siempre se
// incluye localhost para poder seguir usando `npm run dev` en el frontend
// aunque el backend esté desplegado. Además, se acepta automáticamente
// cualquier subdominio *.vercel.app para que los deploys de preview
// (una URL nueva por cada push) funcionen sin tener que actualizar la
// variable de entorno cada vez.
const allowedOrigins = [
  'http://localhost:5173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((url) => url.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Sin "origin" (ej. Postman, curl, health checks) → se permite
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

      if (isAllowed) return callback(null, true);
      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json()); // parseo de JSON en el body de las peticiones

// Ruta de verificación de estado del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CAA API' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/links', linkRoutes);

// Manejo de rutas no encontradas y errores centralizado (siempre al final)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor CAA corriendo en el puerto ${PORT}`);
});
