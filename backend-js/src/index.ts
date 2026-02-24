import "regenerator-runtime/runtime";
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import dns from "dns";

import connectDB from './config/database';
import shipmentRoutes from './modules/shipment/route'; 
import userRoutes from './modules/User/UserRoutes';
import authRoutes from "./modules/auth/route";
import exceptionRoutes from "./modules/Expections/exceptionRoutes";
import runExceptionTracker from "./cron/exceptionTracker";

dotenv.config();
dns.setServers(["1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Root & Health
app.get("/", (req: Request, res: Response) => {
  res.send("Walkwel 3PL API is running. Use /api/shipments for data.");
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Walkwel 3PL API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/shipments', shipmentRoutes);
// (Ensure exceptionRoutes is used if needed: app.use('/api/exceptions', exceptionRoutes); )

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

const startServer = async () => {
  await connectDB();

  // Start cron AFTER DB connected
  runExceptionTracker();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
