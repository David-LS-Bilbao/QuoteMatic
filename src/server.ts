/*
Carga variables de entorno.
Intenta conectar MongoDB.
Después arranca Express.
Mantiene orden claro: config → database → server.
*/


import dotenv from "dotenv";

import app from "./app";
import { connectDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`QuoteMatic server running on http://localhost:${PORT}`);
  });
};

startServer();