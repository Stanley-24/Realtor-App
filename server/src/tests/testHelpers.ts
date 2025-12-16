// Test helper utilities
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key-for-jwt-tokens";

/**
 * Creates a JWT token for a user
 */
export const createTestToken = (userId: string, role: string = "Buyer"): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Creates a test user with default values
 */
export const createTestUser = async (overrides: Partial<{
  fullName: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
}> = {}) => {
  return await User.create({
    fullName: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: "12345678",
    role: "Buyer",
    profilePicture: "",
    ...overrides,
  });
};

/**
 * Creates a test user and returns both user and token
 */
export const createUserWithToken = async (overrides: Partial<{
  fullName: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
}> = {}) => {
  const user = await createTestUser(overrides);
  const token = createTestToken(String(user._id), user.role);
  return { user, token };
};


