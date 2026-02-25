import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index'; 
import dotenv from 'dotenv';

dotenv.config();

describe('Shipment Management System Tests', () => {
  let adminToken: string = '';

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/3pl_backend';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    /**
     * CRITICAL FIX: Ensure the admin user in the DB has a valid MongoDB ObjectId.
     * If your system uses UUIDs globally, you would need to change the 
     * Shipment model 'created_by' type from Schema.Types.ObjectId to String.
     */
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@3pl.com', password: 'admin123' });

    if (res.status !== 200) {
      throw new Error("Setup failed: Could not login. Ensure admin@3pl.com exists.");
    }
    
    adminToken = res.body.accessToken || res.body.token || '';
  }, 20000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // TC01: Valid shipment creation
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
    
    // If you still see CastError here, your backend is receiving a UUID 
    // from the token but the DB expects an ObjectId.
    if (res.status !== 201) {
      console.log("TC01 Error Details:", JSON.stringify(res.body, null, 2));
    }

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  // TC02: Duplicate Shipment ID
  it('TC02: should reject duplicate shipment IDs', async () => {
    const duplicateId = "DUPE-" + Date.now();
    const payload = {
      shipment_id: duplicateId,
      client_name: "Test Client",
      origin: "Chicago",
      destination: "Berlin",
      dispatch_date: "2026-06-01",
      expected_delivery_date: "2026-06-10",
      carrier_name: "DHL"
    };

    await request(app).post('/api/shipments').set('Authorization', `Bearer ${adminToken}`).send(payload);
    
    const res = await request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(400);
    // Flexible check for error location
    const errorMsg = res.body.error || res.body.message || JSON.stringify(res.body);
    expect(errorMsg).toMatch(/duplicate/i);
  });

  // TC03: Logic Validation
  it('TC03: should reject if dispatch date is after expected delivery date', async () => {
    const res = await request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        shipment_id: "DATE-FAIL-" + Date.now(),
        client_name: "Logic Error Ltd",
        origin: "Tokyo",
        destination: "Paris",
        dispatch_date: "2026-12-31",
        expected_delivery_date: "2026-12-01",
        carrier_name: "UPS"
      });
    
    expect(res.status).toBe(400);
    const errorString = JSON.stringify(res.body).toLowerCase();
    expect(errorString).toContain("dispatch date cannot be after");
  });

  // TC04: Soft delete
  it('TC04: should cancel a shipment (soft delete)', async () => {
    const createRes = await request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        shipment_id: "CANCEL-" + Date.now(),
        client_name: "Cancel Corp",
        origin: "Miami",
        destination: "Seattle",
        dispatch_date: "2026-07-01",
        expected_delivery_date: "2026-07-10",
        carrier_name: "Swift"
      });

   const shipmentId = createRes.body.id;
    // Note: ensure your controller returns 'id'. If it returns Mongo '_id', use that.

    const deleteRes = await request(app)
      .delete(`/api/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    if (deleteRes.status !== 200) {
      console.log("TC04 Delete Error:", deleteRes.body);
    }

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.status).toBe("Cancelled");
  });

  // TC05: CSV Bulk Upload
  it('TC05: should process a valid CSV upload', async () => {
    // Create a mock CSV content
    const csvContent = 
      "shipment_id,client_name,origin,destination,dispatch_date,expected_delivery_date,carrier_name\n" +
      `CSV-SHP-${Date.now()},CSV Client,London,Paris,2026-06-01,2026-06-05,DHL`;

    const res = await request(app)
      .post('/api/shipments/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      // Attach the buffer as a file named 'file' (matching your multer config)
      .attach('file', Buffer.from(csvContent), 'test_shipments.csv');

    expect([201, 207]).toContain(res.status);
    expect(res.body.successful_count).toBeGreaterThanOrEqual(1);
    expect(res.body.error_count).toBe(0);
  });

  // TC06: Export Data
  it('TC06: should export shipments in CSV format', async () => {
    const res = await request(app)
      .get('/api/shipments/export?format=csv')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/csv');
    // Check if the body actually looks like CSV data
    expect(res.text).toContain('Shipment ID');
    expect(res.text).toContain('Origin');
  });
});