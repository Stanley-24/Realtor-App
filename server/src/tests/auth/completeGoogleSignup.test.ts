// src/tests/auth/completeGoogleSignup.test.ts
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import { createTestUser } from "../testHelpers";
import { mockGoogleVerifyIdToken } from "../setup";
import User from "../../models/user.model";
import { sendWelcomeEmail } from "../../emails/emailerSender";

describe("POST /api/v1/auth/google/complete-signup", () => {
  beforeEach(() => {
    mockGoogleVerifyIdToken.mockReset();
    jest.clearAllMocks();
  });

  it("successfully completes signup for a new Google user", async () => {
    const mockPayload = {
      email: "newuser@example.com",
      email_verified: true,
      name: "New User",
      picture: "https://example.com/avatar.jpg",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "Buyer" });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("SIGNUP_COMPLETE");
    expect(res.body.user.email).toBe("newuser@example.com");
    expect(res.body.user.role).toBe("Buyer");
    expect(res.body.redirectUrl).toBe("/dashboard/buyer");
    expect(res.body.token).toBeDefined();

    // Verify JWT payload
    const decoded = jwt.decode(res.body.token) as any;
    expect(decoded.userId).toBe(res.body.user._id);
    expect(decoded.role).toBe("Buyer");

    // Verify cookie
    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toBeDefined();
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Strict/);

    // Verify welcome email was sent
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(sendWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "newuser@example.com",
        role: "Buyer",
      }),
      expect.anything()
    );
  });

  it("fails when idToken is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ role: "Buyer" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("ID Token and role are required");
  });

  it("fails when role is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("ID Token and role are required");
  });

  it("fails when Google token has no email", async () => {
    const mockPayload = {
      email_verified: true,
      name: "No Email User",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "Buyer" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid Google token");
  });

  it("fails when role is invalid", async () => {
    const mockPayload = {
      email: "user@example.com",
      email_verified: true,
      name: "Invalid Role User",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "SuperUser" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid role. Must be 'Agent', or 'Buyer'");
  });

  it("successfully handles role case-insensitivity", async () => {
    const mockPayload = {
      email: "caseuser@example.com",
      email_verified: true,
      name: "Case User",
      picture: "",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "aGeNt" });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("Agent");
    expect(res.body.redirectUrl).toBe("/dashboard/agent");
  });

  it("fails when user already exists", async () => {
    const existingUser = await createTestUser({
      fullName: "Existing User",
      email: "existing@example.com",
      role: "Buyer",
    });

    const mockPayload = {
      email: "existing@example.com",
      email_verified: true,
      name: "Existing User",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "Buyer" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists, please login instead.");
  });

  it("handles MongoDB duplicate key error (race condition)", async () => {
    const mockPayload = {
      email: "raceuser@example.com",
      email_verified: true,
      name: "Race User",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const createSpy = jest.spyOn(User, "create").mockImplementationOnce(() => {
      const error: any = new Error("Duplicate key");
      error.code = 11000;
      throw error;
    });

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "Buyer" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists, please login instead.");

    createSpy.mockRestore();
  });

  it("handles server errors gracefully", async () => {
    mockGoogleVerifyIdToken.mockRejectedValue(new Error("Server failure"));

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "Buyer" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error during Google signup completion");
  });

  it("handles JWT generation errors gracefully", async () => {
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error("JWT generation failed");
    });

    const mockPayload = {
      email: "jwtfail@example.com",
      email_verified: true,
      name: "JWT Fail User",
      picture: "",
    };

    mockGoogleVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    } as any);

    const res = await request(app)
      .post("/api/v1/auth/google/complete-signup")
      .send({ idToken: "valid-google-token", role: "Buyer" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error during Google signup completion");

    jest.restoreAllMocks();
  });
});
