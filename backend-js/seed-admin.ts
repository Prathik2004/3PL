import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const existingAdmin = await User.findOne({ role: 'Admin' });
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.email);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@3pl.com',
            password_hash: hashedPassword,
            role: 'Admin',
            mustResetPassword: false
        });

        console.log('✅ Admin user created successfully:');
        console.log('Email: admin@3pl.com');
        console.log('Password: admin123');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
