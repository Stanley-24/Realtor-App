// server/src/tests/user/contactForm.test.ts

import request from "supertest";
import app from "../../app";
import ContactMessage from "../../models/contactMessage.model";
import {
  sendContactConfirmationEmail,
  sendContactNotificationToAdmin,
} from "../../emails/emailerSender";

jest.mock("../../emails/emailerSender", () => ({
  sendContactConfirmationEmail: jest.fn(),
  sendContactNotificationToAdmin: jest.fn(),
}));

beforeAll(async () => {
  // Optional: Connect to test DB if not handled globally
});

afterEach(async () => {
  // Clean up contact messages after each test
  await ContactMessage.deleteMany({});
  // Clear mock calls
  jest.clearAllMocks();
});

afterAll(async () => {
  // Optional: Close DB connection if needed
});

describe("POST /api/v1/contact - Contact Form Submission", () => {
  it("successfully saves contact message and returns 201", async () => {
    const payload = {
      fullName: "Jane Smith",
      email: "owarieta2023@gmail.com",
      message: "Hello! I'm interested in learning more about your real estate services.",
    };

    const res = await request(app).post("/api/v1/contact").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Thank you! Your message has been sent successfully.");
    expect(res.body.data).toMatchObject({
      fullName: "Jane Smith",
      email: "owarieta2023@gmail.com",
      message: payload.message,
    });
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();

    // Verify it was saved in DB
    const savedMessage = await ContactMessage.findOne({ email: "owarieta2023@gmail.com" });
    expect(savedMessage).toBeTruthy();
    expect(savedMessage?.fullName).toBe("Jane Smith");
    expect(savedMessage?.message).toBe(payload.message);

    // Verify email functions were called
    expect(sendContactConfirmationEmail).toHaveBeenCalledWith("Jane Smith", "owarieta2023@gmail.com");
    expect(sendContactNotificationToAdmin).toHaveBeenCalledWith(
      "Jane Smith",
      "owarieta2023@gmail.com",
      payload.message
    );
  });

  it("fails when required fields are missing", async () => {
    const res = await request(app).post("/api/v1/contact").send({
      fullName: "Jane",
      email: "jane@example.com",
      // message missing
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Please fill in all fields");
  });

  it("fails when message is too short (< 10 characters)", async () => {
    const res = await request(app).post("/api/v1/contact").send({
      fullName: "Jane Smith",
      email: "jane@example.com",
      message: "Hi", // only 2 chars
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Message must be at least 10 characters");
  });

  it("fails when message is too long (>= 276 characters)", async () => {
    const longMessage = "a".repeat(276);

    const res = await request(app).post("/api/v1/contact").send({
      fullName: "Jane Smith",
      email: "jane@example.com",
      message: longMessage,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Message must be less than 275 characters or use the email for long messages"
    );
  });

  it("fails with invalid email format (model validation)", async () => {
    const res = await request(app).post("/api/v1/contact").send({
      fullName: "Jane Smith",
      email: "invalid-email",
      message: "This is a valid length message here.",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Please use a valid email address");
  });

  it("handles server/database errors gracefully", async () => {
  jest
    .spyOn(ContactMessage.prototype, "save")
    .mockRejectedValueOnce(new Error("DB failure"));

    const res = await request(app).post("/api/v1/contact").send({
      fullName: "John Doe",
      email: "john@example.com",
      message: "Valid message of sufficient length.",
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error. Please try again later.");

    jest.restoreAllMocks();
  });
});