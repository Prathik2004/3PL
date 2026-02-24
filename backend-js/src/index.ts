import "regenerator-runtime/runtime";
import dns from "dns";
dns.setServers(["1.1.1.1"]);

import express, { Request, Response, NextFunction } from "express";
import shipmentRoutes from "./modules/shipment/route"; // Ensure 'Shipment'
// matches folder name exactly
import exceptionRoutes from "./modules/Expections/exceptionRoutes";
import { authenticate } from "./middleware/authenticate";
import connectDB from "./config/database";
import dotenv from "dotenv";
import runExceptionTracker from "./cron/exceptionTracker";
import userRoutes from "./modules/User/UserRoutes";
dotenv.config();


import authRoutes from "./modules/auth/route";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// Add this above your app.use('/api/shipments', ...)
app.get("/", (req: Request, res: Response) => {
  res.send("Walkwel 3PL API is running. Use /api/shipments for data.");
});


// Basic Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    message: "Walkwel 3PL Control Lite API is running",
  });
});

// Mount the Shipment Module Routes
// This maps to endpoints like POST /api/shipments and GET /api/shipments
app.use("/api/shipments", authenticate, shipmentRoutes);
app.use("/api/exceptions", exceptionRoutes);

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const startServer = async () => {
  await connectDB();

  // Start cron AFTER DB connected
  runExceptionTracker();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
