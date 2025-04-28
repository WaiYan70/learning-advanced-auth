import express from "express";
import { connectDataBase } from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API endpoint
app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Hello 123!");
});

app.listen(PORT, () => {
  connectDataBase();
  console.log(`Server is running on ${PORT} Port`);
});
