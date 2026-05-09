import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";
import healthRoutes from "./routes/health.routes";
import indexRoutes from "./routes/index.routes";
import quoteApiRoutes from "./routes/api/quoteApi.routes";
import catalogApiRoutes from "./routes/api/catalogApi.routes";
import authRoutes from "./routes/auth.routes";
import authApiRoutes from "./routes/api/authApi.routes";
import favoriteApiRoutes from "./routes/api/favoriteApi.routes";
import userQuoteApiRoutes from "./routes/api/userQuoteApi.routes";
import docsRoutes from "./routes/docs.routes";
import webRoutes from "./routes/web.routes";
import adminRoutes from "./routes/admin.routes";

const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGODB_URI;
const trustProxyEnabled = process.env.TRUST_PROXY?.trim().toLowerCase() === "true";
const sessionCookieSecure =
  process.env.SESSION_COOKIE_SECURE?.trim().toLowerCase() === "true";
const sessionCookieSameSite = (
  process.env.SESSION_COOKIE_SAME_SITE?.trim().toLowerCase() ?? "lax"
) as "lax" | "strict" | "none";
const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined");
}

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsAllowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (trustProxyEnabled) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: trustProxyEnabled,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: sessionCookieSameSite,
      secure: sessionCookieSecure,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/", webRoutes);
app.use("/admin", adminRoutes);
app.use("/", docsRoutes);
app.use("/auth", authRoutes);
app.use("/health", healthRoutes);

app.use("/api/quotes", quoteApiRoutes);
app.use("/api/auth", authApiRoutes);
app.use("/api", catalogApiRoutes);
app.use("/api/favorites", favoriteApiRoutes);
app.use("/api/me/quotes", userQuoteApiRoutes);


app.use("/api", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});
    /*
    Solo afecta a rutas que empiezan por /api.
    No rompe las vistas EJS.
    Devuelve JSON limpio para rutas API inexistentes.
    Mejora el hardening mínimo del MVP.
    */


export default app;
