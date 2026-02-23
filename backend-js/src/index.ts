import express, { Request, Response, NextFunction } from 'express';
import shipmentRoutes from './modules/shipment/route'; // Ensure 'Shipment' matches folder name exactly
import connectDB from './config/database';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Add this above your app.use('/api/shipments', ...)
app.get('/', (req: Request, res: Response) => {
  res.send('Walkwel 3PL API is running. Use /api/shipments for data.');
});

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    message: 'Walkwel 3PL Control Lite API is running' 
  });
});

// Mount the Shipment Module Routes
// This maps to endpoints like POST /api/shipments and GET /api/shipments 
app.use('/api/shipments', shipmentRoutes);

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
