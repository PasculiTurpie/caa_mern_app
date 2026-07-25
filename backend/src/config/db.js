import dns from 'node:dns';
import mongoose from 'mongoose';

// En Windows, la librería de resolución DNS que usa Node (c-ares) a veces
// no respeta el DNS configurado en el sistema operativo y falla al
// resolver los registros SRV que usa "mongodb+srv://" (error típico:
// "querySrv ECONNREFUSED"), aunque `nslookup` sí funcione correctamente.
// Forzamos explícitamente el uso de Google/Cloudflare DNS para evitarlo.
dns.setServers(['8.8.8.8', '1.1.1.1']);

/**
 * Conecta a la base de datos MongoDB utilizando Mongoose.
 * Termina el proceso si la conexión falla, ya que la app no puede
 * operar sin persistencia de tableros/tarjetas de usuario.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
