import { mockRequest, mockResponse } from "../setup";
import Property from "../../models/property.model";
import User from "../../models/user.model";
import { createProperty } from "../../controllers/property.controller";

// Mock Cloudinary
const mockUploadImages = jest.fn();
const mockDeleteImage = jest.fn();

jest.mock("../../lib/cloudinary", () => ({
  uploadMultipleImagesToCloudinary: (...args: any[]) => mockUploadImages(...args),
  deleteImageFromCloudinary: (...args: any[]) => mockDeleteImage(...args),
}));

describe("createProperty", () => {
  let agent: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Property.deleteMany({});

    agent = await User.create({
      fullName: "Agent Test",
      email: `agent${Date.now()}@test.com`,
      role: "Agent",
      password: "12345678",
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
    await Property.deleteMany({});
  });

  it("creates a property successfully", async () => {
    // Mock successful image upload
    mockUploadImages.mockResolvedValue([
      "https://res.cloudinary.com/demo/img1.jpg",
      "https://res.cloudinary.com/demo/img2.jpg",
    ]);

    // DO NOT mock mongoose.startSession()
    // Your setup already uses MongoMemoryReplSet, which supports real transactions

    const req = mockRequest({
      body: {
        title: "House A",
        description: "Desc",
        location: "L",
        type: "House",
        status: "Available",
        price: 1000,
        bedrooms: 2,
        bathrooms: 1,
        squareFootage: 500,
      },
      files: [
        {
          buffer: Buffer.from("test1"),
          mimetype: "image/jpeg",
          originalname: "1.jpg",
          fieldname: "images",
          size: 1024,
        },
        {
          buffer: Buffer.from("test2"),
          mimetype: "image/jpeg",
          originalname: "2.jpg",
          fieldname: "images",
          size: 1024,
        },
      ],
      user: agent,
    });

    const res = mockResponse();

    await createProperty(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Property created successfully",
        property: expect.objectContaining({
          title: "House A",
          agent: agent._id,
          images: [
            "https://res.cloudinary.com/demo/img1.jpg",
            "https://res.cloudinary.com/demo/img2.jpg",
          ],
        }),
      })
    );

    // Verify property exists in DB
    const savedProperty = await Property.findOne({ title: "House A" });
    expect(savedProperty).toBeDefined();

    // Verify agent's listings were updated
    const updatedAgent = await User.findById(agent._id);
    expect(updatedAgent).toBeDefined();
    expect(updatedAgent!.listings).toHaveLength(1);

    expect(String(updatedAgent!.listings![0])).toBe(String(savedProperty!._id));
  });

  it("returns 400 if required fields are missing", async () => {
    const req = mockRequest({ body: {}, user: agent });
    const res = mockResponse();

    await createProperty(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Required fields cannot be empty",
    });
  });

  it("returns 400 if property type is invalid", async () => {
    const req = mockRequest({
      body: {
        title: "X",
        description: "Y",
        location: "L",
        type: "Boat",
        status: "Available",
        price: 1000,
      },
      user: agent,
    });
    const res = mockResponse();

    await createProperty(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid property type" });
  });

  it("returns 400 if property status is invalid", async () => {
    const req = mockRequest({
      body: {
        title: "X",
        description: "Y",
        location: "L",
        type: "House",
        status: "Flying",
        price: 1000,
      },
      user: agent,
    });
    const res = mockResponse();

    await createProperty(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid property status" });
  });

  it("returns 400 for invalid numeric fields", async () => {
    const req = mockRequest({
      body: {
        title: "House B",
        description: "Desc",
        location: "Loc",
        type: "House",
        status: "Available",
        price: -1000,
        bedrooms: -1,
        bathrooms: -2,
        squareFootage: 0,
      },
      user: agent,
    });
    const res = mockResponse();

    await createProperty(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it("returns 401 if user not authenticated", async () => {
    const req = mockRequest({
      body: {
        title: "House",
        description: "Desc",
        location: "L",
        type: "House",
        status: "Available",
        price: 1000,
      },
    });
    const res = mockResponse();

    await createProperty(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" });
  });

  it("returns 500 if Cloudinary upload fails", async () => {
    mockUploadImages.mockRejectedValue(new Error("Upload failed"));

    const req = mockRequest({
      user: agent,
      body: {
        title: "Nice House",
        description: "Good home",
        location: "Lagos",
        type: "House",
        status: "Available",
        price: 1000000,
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1200,
      },
      files: [
        { buffer: Buffer.from("bad"), mimetype: "image/jpeg", originalname: "bad.jpg" },
      ],
    });

    const res = mockResponse();

    await createProperty(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error uploading images" });
  });
});