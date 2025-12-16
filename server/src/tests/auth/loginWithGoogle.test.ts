// src/tests/loginWithGoogle.test.ts
// Common mocks are in setup.ts

import request from "supertest";
import app from "../../app";
import { createTestUser } from "../testHelpers";
import { mockGoogleVerifyIdToken } from "../setup";

describe("POST /api/v1/auth/google/login", () => {
  beforeEach(() => {
    // Reset mock before each test
    mockGoogleVerifyIdToken.mockReset();
  });

  it("successfully logs in existing user with valid Google token", async () => {
    // Create an existing user
    const existingUser = await createTestUser({
      fullName: "John Doe",
      email: "john@example.com",
      role: "Buyer",
      profilePicture: "https://example.com/picture.jpg",
    });

    // Mock Google token verification
    const mockPayload = {
      email: "john@example.com",
      email_verified: true,
      name: "John Doe",
      picture: "https://example.com/picture.jpg",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({ idToken: "valid-google-token" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("EXISTING_USER");
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.body.user._id).toBe(String(existingUser._id));
    expect(res.body.redirectUrl).toBe("/dashboard/buyer");
    expect(res.body.token).toBeDefined();

    // Verify cookie is set
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
  });

  it("returns NEW_USER status for new Google user", async () => {
    // Mock Google token verification for new user
    const mockPayload = {
      email: "newuser@example.com",
      email_verified: true,
      name: "New User",
      picture: "https://example.com/new-picture.jpg",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({ idToken: "valid-google-token" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("NEW_USER");
    expect(res.body.message).toBe("Role required");
    expect(res.body.email).toBe("newuser@example.com");
    expect(res.body.fullName).toBe("New User");
    expect(res.body.profilePicture).toBe("https://example.com/new-picture.jpg");
    expect(res.body.needsRole).toBe(true);
    expect(res.body.redirectUrl).toBe("/select-role");
  });

  it("fails when idToken is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Google ID Token is required");
  });

  it("fails when idToken is invalid", async () => {
    // Mock Google token verification to throw an error
    mockGoogleVerifyIdToken.mockRejectedValue(new Error("Invalid token"));

    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({ idToken: "invalid-google-token" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error during Google authentication");
  });

  it("fails when Google token has no email", async () => {
    // Mock Google token verification with no email
    const mockPayload = {
      email_verified: true,
      name: "User Without Email",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({ idToken: "valid-google-token" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid Google token");
  });

  it("fails when email is not verified by Google", async () => {
    // Mock Google token verification with unverified email
    const mockPayload = {
      email: "unverified@example.com",
      email_verified: false,
      name: "Unverified User",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({ idToken: "valid-google-token" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email not verified by Google");
  });

  it("normalizes email to lowercase", async () => {
    // Create user with lowercase email
    await createTestUser({
      email: "test@example.com",
      fullName: "Test User",
    });

    // Mock Google token with uppercase email
    const mockPayload = {
      email: "TEST@EXAMPLE.COM",
      email_verified: true,
      name: "Test User",
      picture: "",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({ idToken: "valid-google-token" });

    // Should find the user despite case difference
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("EXISTING_USER");
  });

  it("handles existing user with different role", async () => {
    // Create an Agent user
    const agentUser = await createTestUser({
      fullName: "Agent Smith",
      email: "agent@example.com",
      role: "Agent",
    });

    const mockPayload = {
      email: "agent@example.com",
      email_verified: true,
      name: "Agent Smith",
      picture: "",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/login")
      .send({ idToken: "valid-google-token" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("EXISTING_USER");
    expect(res.body.user.role).toBe("Agent");
    expect(res.body.redirectUrl).toBe("/dashboard/agent");
  });
});

