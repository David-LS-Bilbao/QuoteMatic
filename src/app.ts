import express  from "express";
import path from "path";

import indexRoutes from "./routes/index.routes";
import healthRoutes from "./routes/health.routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/health", healthRoutes);

export default app;