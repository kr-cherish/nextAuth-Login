import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/UserData";
console.log(MONGO_URI);

const connect = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  if (mongoose.connections[0].readyState) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any); // TypeScript fix for mongoose options

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
