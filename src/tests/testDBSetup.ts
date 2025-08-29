import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
      process.env.MONGO_TEST_URI = mongoServer.getUri();
    }

    if (!process.env.MONGO_TEST_URI) {
      throw new Error("MONGO_TEST_URI is not defined");
    }
    await mongoose.connect(process.env.MONGO_TEST_URI);
    console.log("Connected to MongoDB");
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});
