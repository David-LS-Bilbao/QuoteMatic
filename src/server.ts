import dotenv from "dotenv";

import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`QuoteMatic server running on http://localhost:${PORT}`);
});