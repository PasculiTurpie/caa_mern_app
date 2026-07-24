import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

// CORS: permite peticiones desde el frontend (Vite dev server u origen configurado)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

// Manejo de rutas no encontradas y errores centralizado (siempre al final)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor CAA corriendo en el puerto ${PORT}`);
});
