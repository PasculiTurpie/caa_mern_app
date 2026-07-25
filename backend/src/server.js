import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

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

app.use('/api/auth', authRoutes);
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
