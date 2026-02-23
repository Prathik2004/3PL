import express from "express";
import type { Request, Response } from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./modules/User/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "3PL - Server is running successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
