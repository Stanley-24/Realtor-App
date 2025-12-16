// src/tests/getCurrentUser.test.ts
// Common mocks are in setup.ts

import request from "supertest";
import app from "../../app";
import { createUserWithToken, createTestToken } from "../testHelpers";

describe("GET /api/v1/auth/me", () => {
  let testUser: any;
  let validToken: string;

  beforeEach(async () => {
    const result = await createUserWithToken({
      fullName: "Jane Doe",
      email: "jane@example.com",
      profilePicture: "https://example.com/avatar.jpg",
    });
    testUser = result.user;
    validToken = result.token;
  });

  it("returns current user info when authenticated with Bearer token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user._id).toBe(String(testUser._id));
    expect(res.body.user.fullName).toBe("Jane Doe");
    expect(res.body.user.email).toBe("jane@example.com");
    expect(res.body.user.role).toBe("Buyer");
    expect(res.body.user.profilePicture).toBe("https://example.com/avatar.jpg");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("returns current user info when authenticated with cookie", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", `jwt=${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("jane@example.com");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("fails when no token is provided", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized, token missing");
  });

  it("fails when token is invalid", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid or expired token");
  });

  it("fails when token has invalid format in Authorization header", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "InvalidFormat token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid authorization header format");
  });

  it("fails when Authorization header is just 'Bearer ' with no token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer ");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid authorization header format");
  });

  it("fails when user from token doesn't exist in database", async () => {
    // Create a token for a non-existent user
    const fakeUserId = "507f1f77bcf86cd799439011"; // Valid ObjectId format but doesn't exist
    const fakeToken = createTestToken(fakeUserId, "Buyer");

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("User not found or token invalid");
  });

  it("returns user info for different roles", async () => {
    const { user: agentUser, token: agentToken } = await createUserWithToken({
      fullName: "Agent Smith",
      email: "agent@example.com",
      role: "Agent",
    });

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${agentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("Agent");
    expect(res.body.user.email).toBe("agent@example.com");
  });
});

