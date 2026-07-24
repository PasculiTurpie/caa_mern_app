import mongoose from 'mongoose';

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
