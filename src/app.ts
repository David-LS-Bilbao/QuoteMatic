import express from "express";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";

import healthRoutes from "./routes/health.routes";
import indexRoutes from "./routes/index.routes";
import quoteApiRoutes from "./routes/api/quoteApi.routes";
import catalogApiRoutes from "./routes/api/catalogApi.routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGODB_URI;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined");
}

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/health", healthRoutes);

app.use("/api/quotes", quoteApiRoutes);
app.use("/api", catalogApiRoutes);

export default app;