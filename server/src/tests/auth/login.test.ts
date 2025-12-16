// src/tests/login.test.ts
// Common mocks (including bcryptjs) are in setup.ts

import request from "supertest";
import app from "../../app";
import { createTestUser } from "../testHelpers";

beforeEach(async () => {
  // Seed a user with password that will be hashed by pre-save hook
  // The bcrypt mock will hash "12345678" to "hashed-12345678"
  await createTestUser({
    fullName: "John Doe",
    email: "john@example.com",
    role: "Buyer",
  });
});

describe("POST /api/v1/auth/login", () => {
  it("logs in successfully and sets session cookie", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "john@example.com",
        password: "12345678",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.body.redirectUrl).toBe("/dashboard/buyer");

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=/);       // Any token
    expect(cookies[0]).toMatch(/HttpOnly/);
    expect(cookies[0]).toMatch(/Path=\//);
    expect(cookies[0]).toMatch(/SameSite=Strict/); // Only if you set it in generateToken

  });

  it("fails when email or password is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "john@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Please provide both email and password");
  });

  it("fails with invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "12345678",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("fails with invalid password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "john@example.com",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
