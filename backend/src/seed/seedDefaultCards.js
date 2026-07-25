import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Card from '../models/Card.js';
import defaultCards from './defaultCards.js';

dotenv.config();

/**
 * Script de seed: crea (si no existe) un usuario "Sistema CAA" que actúa
 * como propietario de las tarjetas predefinidas, y luego inserta el set
 * de tarjetas por defecto como públicas, evitando duplicados si el script
 * se ejecuta más de una vez.
 *
 * Uso: npm run seed   (desde la carpeta backend/)
 */
const SEED_USER_EMAIL = 'sistema@caa-app.local';

const run = async () => {
  await connectDB();

  // Busca o crea el usuario "sistema" dueño de las tarjetas públicas por defecto
  let systemUser = await User.findOne({ email: SEED_USER_EMAIL });
  if (!systemUser) {
    systemUser = await User.create({
      name: 'Sistema CAA',
      email: SEED_USER_EMAIL,
      password: Math.random().toString(36).slice(2) + Date.now(), // contraseña aleatoria, no se usa para login
      role: 'terapeuta',
    });
    console.log('Usuario "Sistema CAA" creado para alojar las tarjetas predefinidas.');
  }

  let created = 0;
  let skipped = 0;

  for (const cardData of defaultCards) {
    const exists = await Card.findOne({
      text: cardData.text,
      category: cardData.category,
      creator: systemUser._id,
    });

    if (exists) {
      skipped += 1;
      continue;
    }

    await Card.create({
      ...cardData,
      creator: systemUser._id,
      isPublic: true,
    });
    created += 1;
  }

  console.log(`Seed completado: ${created} tarjetas creadas, ${skipped} ya existían.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error('Error al ejecutar el seed:', error);
  process.exit(1);
});
