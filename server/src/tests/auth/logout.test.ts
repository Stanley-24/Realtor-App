// src/tests/logout.test.ts
// Common mocks are in setup.ts

import request from "supertest";
import app from "../../app";
import { createUserWithToken } from "../testHelpers";

describe("POST /api/v1/auth/logout", () => {
  it("logs out successfully with Bearer token and clears cookie", async () => {
    const { token } = await createUserWithToken({
      fullName: "Test User",
      email: "test@example.com",
    });

    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");

    // Verify cookie is cleared
    const cookies = Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [];
    expect(cookies).toBeDefined();
    const clearCookieHeader = cookies.find((cookie: string) => cookie.includes("jwt="));
    expect(clearCookieHeader).toBeDefined();
    expect(clearCookieHeader).toContain("jwt=;"); // Cookie cleared
  });

  it("logs out successfully with cookie authentication", async () => {
    const { token } = await createUserWithToken({
      fullName: "Test User",
      email: "test2@example.com",
    });

    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");

    // Verify cookie is cleared
    const cookies = Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [];
    expect(cookies).toBeDefined();
    const clearCookieHeader = cookies.find((cookie: string) => cookie.includes("jwt="));
    expect(clearCookieHeader).toBeDefined();
  });

  it("fails when no token is provided", async () => {
    const res = await request(app).post("/api/v1/auth/logout");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized, token missing");
  });

  it("fails with invalid token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid or expired token");
  });

  it("clears cookie with correct options", async () => {
    const { token } = await createUserWithToken();

    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    
    // Check that cookie clearing includes proper options
    const cookies = Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [];
    const clearCookieHeader = cookies.find((cookie: string) => cookie.includes("jwt="));
    
    // Cookie should be cleared with httpOnly, sameSite, and secure flags
    expect(clearCookieHeader).toContain("HttpOnly");
    expect(clearCookieHeader).toContain("SameSite=Strict");
  });
});

