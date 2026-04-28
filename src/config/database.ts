// archivo de conexion a la base de datos.
/*

Centraliza la conexión a MongoDB.
Evita que server.ts tenga lógica de infraestructura.
Permite arrancar la app aunque todavía no tengas Mongo configurado.
*/

import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI is not defined. Database connection skipped.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};