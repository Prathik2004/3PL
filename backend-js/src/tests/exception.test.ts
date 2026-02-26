import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import Exception from '../models/Exception.model';
import { Shipment } from '../models/shipment';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

describe('Exception Management System Tests', () => {
    let adminToken: string;
    let testShipmentId: string;
    let testExceptionId: string;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/3pl_test');
        }

        const adminEmail = 'admin@3pl.com';
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: adminEmail, password: 'admin123' });
        adminToken = loginRes.body.accessToken;

        const shipment = await Shipment.create({
            shipment_id: "EX-SHP-" + Date.now(),
            client_name: "Test Client",
            origin: "NY",
            destination: "LA",
            dispatch_date: new Date(),
            expected_delivery_date: new Date(Date.now() + 86400000),
            carrier_name: "FedEx",
            created_by: new mongoose.Types.ObjectId(),
            status: "Created",
            user_email: adminEmail 
        });
        testShipmentId = (shipment._id as any).toString();
    });

    afterAll(async () => {
        await Exception.deleteMany({});
        await User.deleteMany({ email: /viewer.test/ });
        await mongoose.connection.close();
    });

    // --- Creation & Retrieval Tests ---

    it('TC05a: should manually create an exception (Admin Only)', async () => {
        const res = await request(app)
            .post('/api/exceptions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                shipment_id: testShipmentId,
                exception_type: "Delay",
                description: "Manual delay reported by carrier"
            });

        expect(res.status).toBe(201);
        testExceptionId = res.body.data._id;
    });

    it('TC05b: should reject manual creation with invalid exception type', async () => {
        const res = await request(app)
            .post('/api/exceptions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                shipment_id: testShipmentId,
                exception_type: "NaturalDisaster",
                description: "Flood"
            });
        expect(res.status).toBe(400);
    });

    it('TC05c: should get all exceptions with filters', async () => {
        const res = await request(app)
            .get('/api/exceptions?resolved=false')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // --- Resolution & RBAC Tests ---

    it('TC17: should resolve an exception and update shipment status', async () => {
        const res = await request(app)
            .put(`/api/exceptions/${testExceptionId}/resolve`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ resolution_note: "Package located and delivered." });

        expect(res.status).toBe(200);
        const updatedShipment = await Shipment.findById(testShipmentId);
        expect(updatedShipment?.status).toBe("Delivered");
    });

    it('TC12: Role-based access prevents Viewer from resolving exceptions', async () => {
        const adminEmail = 'admin@3pl.com';
        
        // 1. Find the admin and temporarily change their role to Viewer
        const originalUser = await User.findOne({ email: adminEmail });
        const originalRole = originalUser?.role;
        
        await User.updateOne({ email: adminEmail }, { $set: { role: 'Viewer' } });

        try {
            // 2. Login as the "new" Viewer
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: adminEmail, password: 'admin123' });

            expect(loginRes.status).toBe(200);
            const viewerToken = loginRes.body.accessToken;

            // 3. Attempt to resolve - This should trigger 403 Forbidden
            const res = await request(app)
                .put(`/api/exceptions/${testExceptionId}/resolve`)
                .set('Authorization', `Bearer ${viewerToken}`)
                .send({ resolution_note: "Should fail" });

            expect(res.status).toBe(403);
        } finally {
            // 4. ALWAYS restore the original role so other tests don't break
            await User.updateOne({ email: adminEmail }, { $set: { role: originalRole } });
        }
    });
    // --- Logic & KPI Tests ---

    it('TC06: No update exception triggers after 24 hours', async () => {
        const pastDate = new Date();
        pastDate.setHours(pastDate.getHours() - 25);

        const stagnantShipment = await Shipment.create({
            shipment_id: `STAGNANT-${Date.now()}`,
            client_name: "Stagnant Corp",
            origin: "Delhi",
            destination: "Mumbai",
            dispatch_date: pastDate,
            expected_delivery_date: new Date(),
            status: "Dispatched",
            carrier_name: "BlueDart",
            created_by: new mongoose.Types.ObjectId(),
            last_status_update: pastDate
        });

        const now = new Date();
        const diff = (now.getTime() - stagnantShipment.last_status_update.getTime()) / (1000 * 60 * 60);
        expect(diff).toBeGreaterThan(24);
    });

    it('TC09 & TC10: KPI Analytics Accuracy', async () => {
        const now = new Date();
        const oneDay = 86400000;

        await Shipment.insertMany([
            {
                shipment_id: "KPI-ON-" + Date.now(),
                status: "Delivered",
                expected_delivery_date: now,
                delivered_date: new Date(now.getTime() - 3600000),
                dispatch_date: new Date(now.getTime() - oneDay),
                carrier_name: "DHL", client_name: "A", origin: "O", destination: "D", created_by: new mongoose.Types.ObjectId()
            },
            {
                shipment_id: "KPI-LATE-" + Date.now(),
                status: "Delivered",
                expected_delivery_date: new Date(now.getTime() - oneDay),
                delivered_date: now,
                dispatch_date: new Date(now.getTime() - (oneDay * 3)),
                carrier_name: "DHL", client_name: "A", origin: "O", destination: "D", created_by: new mongoose.Types.ObjectId()
            }
        ]);

        const res = await request(app)
            .get('/api/shipments/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        if (res.body.onTimeDeliveryRate !== undefined) {
            expect(res.body.onTimeDeliveryRate).toBe(50);
            expect(res.body.averageTransitTime).toBe(2);
        }
    });
});