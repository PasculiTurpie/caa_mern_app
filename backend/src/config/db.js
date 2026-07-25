import mongoose from "mongoose";
import dns from "dns";

// Force IPv4 DNS resolution and use public DNS servers (fixes ISP SRV lookup blocks)
dns.setDefaultResultOrder("ipv4first");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn(
    "No se pudieron establecer los servidores DNS personalizados:",
    err.message,
  );
}

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in your environment variables (.env)",
      );
    }

    console.log("Intentando conectar a MongoDB Atlas...");

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      family: 4, // Force IPv4 connection
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
