import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

let mongo: MongoMemoryReplSet;
let consoleErrorSpy: jest.SpyInstance;
/**
 * Initialize in-memory MongoDB replica set for tests
 */
export const startMongoMemoryReplSet = async () => {
  jest.setTimeout(60000); // 60s timeout for slow startup
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  // Close existing connections if any
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(true);
  }

  // Start in-memory replica set
  mongo = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });

  const uri = mongo.getUri();
  await mongoose.connect(uri, { dbName: "testdb" });

  console.log("✅ MongoMemoryReplSet started for transactions");
};

/**
 * Clear all collections before each test
 */
export const clearDatabase = async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (const c of collections) await c.deleteMany({});
  }
};

/**
 * Stop the in-memory MongoDB
 */
export const stopMongoMemoryReplSet = async () => {
  if (consoleErrorSpy) consoleErrorSpy.mockRestore();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(true);
  }
  if (mongo) await mongo.stop();

};
