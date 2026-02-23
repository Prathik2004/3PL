import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user';

dotenv.config();

async function findAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const admins = await User.find({ role: 'Admin' }, { email: 1, name: 1 });
        if (admins.length > 0) {
            console.log('Admin Users found:');
            console.log(JSON.stringify(admins, null, 2));
        } else {
            console.log('No Admin users found in the database.');
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

findAdmin();
