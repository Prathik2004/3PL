import mongoose from "mongoose";

const connectDB = async () => {
    try {
       const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/3pl");
       console.log("mongoDB connected: ", conn.connection.host);
    } catch (error) {
       if(error instanceof Error) {
        console.error("Error connecting to MongoDB: ", error.message);
       }               
    }
}

export default connectDB;