import mongoose, { ConnectOptions } from "mongoose";

const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions )
        console.log(`MongoDB Connected: ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1);
    }
};

export default connectDb;