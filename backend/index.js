import express from "express";
import { connectDataBase } from "./database/index.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello 123!");
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  connectDataBase();
  console.log(`Server is running on ${PORT} Port`);
});
