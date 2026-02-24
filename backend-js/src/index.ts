import "regenerator-runtime/runtime";

import express, { Request, Response, NextFunction } from 'express';
import shipmentRoutes from './modules/shipment/route'; // Ensure 'Shipment' matches folder name exactly
import connectDB from './config/database';
import userRoutes from './modules/User/UserRoutes';
import dotenv from 'dotenv';

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
import cors from "cors";
import authRoutes from "./modules/auth/route";

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Adjust this to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

app.use('/api/shipments', shipmentRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
