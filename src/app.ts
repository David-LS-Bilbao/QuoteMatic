import express from "express";
import path from "path";

import healthRoutes from "./routes/health.routes";
import indexRoutes from "./routes/index.routes";
import quoteApiRoutes from "./routes/api/quoteApi.routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/health", healthRoutes);

app.use("/api/quotes", quoteApiRoutes);

export default app;