import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { User } from "../models/User";

dotenv.config();

const ADMIN_NAME = "Admin Demo";
const ADMIN_EMAIL = "admin@quotematic.local";
const ADMIN_PASSWORD = "Admin123!";
const SALT_ROUNDS = 10;

const run = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI no está definida. Comprueba tu archivo .env.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB conectado.");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  const existing = await User.findOne({ email: ADMIN_EMAIL }).lean();

  if (existing) {
    await User.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          name: ADMIN_NAME,
          passwordHash,
          role: "admin",
          ageGroup: "adult_18_plus",
          isActive: true,
        },
      }
    );
    console.log(`Usuario admin actualizado: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
      ageGroup: "adult_18_plus",
      isActive: true,
    });
    console.log(`Usuario admin creado: ${ADMIN_EMAIL}`);
  }

  console.log("\n  Credenciales de demo:");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Rol:      admin`);
  console.log(`  Grupo:    adult_18_plus`);
  console.log("\n  ADVERTENCIA: solo para desarrollo y demo. No usar en producción.");
};

run()
  .catch((err) => {
    console.error("seedAdmin fallido:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("Conexión MongoDB cerrada.");
  });
