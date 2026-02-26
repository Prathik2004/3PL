import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index'; 
import dotenv from 'dotenv';
import { User } from '../models/user';

dotenv.config();

describe('Shipment Management System Tests', () => {
  let adminToken: string = '';

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/3pl_test');
    }
    
    // Ensure Admin exists for login
    await User.findOneAndUpdate(
        { email: 'admin@3pl.com' },
        { email: 'admin@3pl.com', password: 'admin123', role: 'Admin' },
        { upsert: true }
    );

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@3pl.com', password: 'admin123' });

    adminToken = res.body.accessToken;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('TC01: should create a valid shipment', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        shipment_id: "SHP-" + Date.now(),
        client_name: "Acme Corp",
        origin: "New York",
        destination: "London",
        dispatch_date: "2026-05-01",
        expected_delivery_date: "2026-05-10",
        carrier_name: "FedEx"
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('TC02: should reject duplicate shipment IDs', async () => {
    const dupeId = "DUPE-" + Date.now();
    const payload = {
      shipment_id: dupeId,
      client_name: "Test", origin: "A", destination: "B",
      dispatch_date: "2026-06-01", expected_delivery_date: "2026-06-10", carrier_name: "DHL"
    };

    await request(app).post('/api/shipments').set('Authorization', `Bearer ${adminToken}`).send(payload);
    const res = await request(app).post('/api/shipments').set('Authorization', `Bearer ${adminToken}`).send(payload);

    expect(res.status).toBe(400);
  });

  it('TC03: should reject if dispatch date is after expected delivery date', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        shipment_id: "DATE-FAIL-" + Date.now(),
        client_name: "Logic Error",
        origin: "Tokyo",
        destination: "Paris",
        dispatch_date: "2026-12-31",
        expected_delivery_date: "2026-12-01",
        carrier_name: "UPS"
      });
    
    expect(res.status).toBe(400);
  });

  it('TC05: should process a valid CSV upload', async () => {
    const csvContent = 
      "shipment_id,client_name,origin,destination,dispatch_date,expected_delivery_date,carrier_name\n" +
      `CSV-SHP-${Date.now()},CSV Client,London,Paris,2026-06-01,2026-06-05,DHL`;

    const res = await request(app)
      .post('/api/shipments/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from(csvContent), 'test.csv');

    expect([201, 207]).toContain(res.status);
  });

  it('TC06: should export shipments in CSV format', async () => {
    const res = await request(app)
      .get('/api/shipments/export?format=csv')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
  });
});