import express from "express";
import { connectDataBase } from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = ["http://localhost:5173"];

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API endpoint
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello 123!");
});

app.listen(PORT, () => {
  connectDataBase();
  console.log(`Server is running on ${PORT} Port`);
});
