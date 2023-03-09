import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
// route files
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";

const CURRENT_WORKING_DIR = process.cwd();

const app = express();
// Morgan (logger)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// data sanitization against NoSQL query injection
app.use(mongoSanitize());
// data sanitization against xss
app.use(xss());
// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors({ origin: "*" }));

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

// mount routes
// auth routes before signin
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log("error ==> ", err);
  }
});

export default app;
