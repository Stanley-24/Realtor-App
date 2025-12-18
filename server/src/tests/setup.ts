// server/src/tests/setup.ts

// Common mocks used across all tests
import jwt from "jsonwebtoken";
import config from "../config/config";

const JWT_SECRET = config.JWT_SECRET || "test-secret-key-for-jwt-tokens";

jest.mock("../lib/utils.ts", () => ({
  generateToken: jest.fn((userId: string, role: string, res: any) => {
    // Create a real JWT
    const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
    // Set cookie
    res.cookie("jwt", token, { httpOnly: true, sameSite: "Strict" });

    return token;
  }),
  getDashboardUrl: jest.fn((role: string) => {
    const map: Record<string, string> = {
      Buyer: "/dashboard/buyer",
      Agent: "/dashboard/agent",
      Admin: "/dashboard/admin",
    };
    return map[role] ?? "/dashboard";
  }),
}));
jest.mock("../emails/emailerSender.ts", () => ({
  sendWelcomeEmail: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(() => Promise.resolve("mock-salt")),
  hash: jest.fn((password) => Promise.resolve(`hashed-${password}`)),
  compare: jest.fn((plain, hashed) => {
    // Simple mock: if password === "12345678" it matches
    // This allows login tests to work when comparing "12345678" with any stored hash
    return Promise.resolve(plain === "12345678");
  }),
}));

jest.mock("jsonwebtoken", () => {
  const jwt = jest.requireActual("jsonwebtoken");
  
  // Helper to create JWT errors
  const createJWTError = (message: string = "jwt malformed") => {
    const error = new Error(message) as any;
    error.name = "JsonWebTokenError";
    return error;
  };

  // Helper to validate JWT format
  const isValidJWTFormat = (token: string): boolean => {
    return typeof token === "string" && token.split(".").length === 3;
  };

  return {
    ...jwt,
    verify: jest.fn((token: string, secret: string) => {
      // Validate token type
      if (!token || typeof token !== "string") {
        throw createJWTError();
      }

      // Check for obviously invalid tokens
      if (token === "invalid-token" || !isValidJWTFormat(token)) {
        throw createJWTError();
      }

      // Decode without verification (jwt.decode doesn't verify signature)
      const decoded = jwt.decode(token, { complete: false });
      
      if (!decoded || typeof decoded !== "object") {
        throw createJWTError();
      }

      return decoded;
    }),
  };
});

// Create a shared mock function that can be accessed in tests
export const mockGoogleVerifyIdToken = jest.fn();

jest.mock("google-auth-library", () => {
  const OAuth2Client = jest.fn().mockImplementation(() => ({
    verifyIdToken: mockGoogleVerifyIdToken,
  }));

  return {
    OAuth2Client,
  };
});

// import setup components for MongoDB from helper file

import { startMongoMemoryReplSet, clearDatabase, stopMongoMemoryReplSet } from "./properties/helpers/setup-mongo";
import redisClient from "../config/redis";

beforeAll(async () => {
  await startMongoMemoryReplSet();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await stopMongoMemoryReplSet();
  await redisClient.quit();
});
// Add shared helpers for controller tests
export { mockRequest, mockResponse } from "./properties/helpers/controllerHelper";
