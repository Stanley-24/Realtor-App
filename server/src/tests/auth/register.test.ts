// src/tests/register.test.ts
// Common mocks are in setup.ts

import request from "supertest";
import app from "../../app";

describe("POST /api/v1/auth/signup", () => {

  it("registers a user successfully and sets session cookie", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "12345678",
        role: "Buyer",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.body.redirectUrl).toBe("/dashboard/buyer");

    // ✅ Check that the cookie is set
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=/);       // Any token
    expect(cookies[0]).toMatch(/HttpOnly/);
    expect(cookies[0]).toMatch(/Path=\//);
    expect(cookies[0]).toMatch(/SameSite=Strict/); // Only if you set it in generateToken

  });

  it("fails when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        email: "john@example.com",
        password: "12345678",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Please fill in all required fields");
  });

  it("fails on duplicate email", async () => {
    // First registration
    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        fullName: "User One",
        email: "john@example.com",
        password: "12345678",
      });

    // Second registration
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        fullName: "User Two",
        email: "john@example.com",
        password: "12345678",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

});
