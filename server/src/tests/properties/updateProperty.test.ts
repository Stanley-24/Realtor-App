import { mockRequest, mockResponse } from "../setup";
import { createTestData } from "./helpers/createProp";
import { updateProperty } from "../../controllers/property.controller";
import { uploadMultipleImagesToCloudinary, deleteImageFromCloudinary } from "../../lib/cloudinary";
import mongoose from "mongoose";
import User from "../../models/user.model";
import Property from "../../models/property.model";

// Mock cloudinary functions
jest.mock("../../lib/cloudinary", () => ({
  uploadMultipleImagesToCloudinary: jest.fn(async (buffers: Buffer[], folder: string) =>
    buffers.map((_: Buffer, i: number) => `https://cloudinary.com/${folder}/image${i}.jpg`)
  ),
  deleteImageFromCloudinary: jest.fn(async (url: string) => true),
}));

describe("updateProperty", () => {
  let agent: any;
  let properties: any[];

  beforeEach(async () => {
    const data = await createTestData();
    agent = data.agent;
    properties = data.properties;

    // Ensure properties[0] has one image for removal tests
    properties[0].images = ["https://cloudinary.com/properties/image0.jpg"];
    await properties[0].save();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
    await Property.deleteMany({});
  });

  it("returns 400 if invalid property ID", async () => {
    const req = mockRequest({ params: { id: "invalidId" }, user: { _id: agent._id } });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 401 if user not authenticated", async () => {
    const req = mockRequest({ params: { id: properties[0]._id }, user: {} });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 404 if property not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const req = mockRequest({ params: { id: fakeId }, user: { _id: agent._id } });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 403 if user is not owner or admin", async () => {
    // Create another agent with unique email
    const otherUser = await User.create({
      fullName: "Other Agent",
      email: "otheragent@test.com",
      role: "Agent",
      password: "12345678",
    });

    const req = mockRequest({
      params: { id: properties[0]._id },
      user: { _id: otherUser._id, role: "Agent" },
    });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 400 for invalid type or status", async () => {
    const req = mockRequest({
      params: { id: properties[0]._id },
      user: { _id: agent._id },
      body: { type: "Castle", status: "Flying" },
    });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 for invalid numeric fields", async () => {
    const req = mockRequest({
      params: { id: properties[0]._id },
      user: { _id: agent._id },
      body: { price: -500, bedrooms: -1, bathrooms: -2, squareFootage: -10 },
    });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updates property successfully without images", async () => {
    const req = mockRequest({
      params: { id: properties[0]._id },
      user: { _id: agent._id },
      body: { price: 600000, bedrooms: 4 },
    });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data.price).toBe(600000);
    expect(res.json.mock.calls[0][0].data.bedrooms).toBe(4);
  });

  it("uploads new images successfully", async () => {
    const fakeFile = { buffer: Buffer.from("test"), mimetype: "image/jpeg" } as Express.Multer.File;
    const req = mockRequest({
      params: { id: properties[0]._id },
      user: { _id: agent._id },
      files: [fakeFile],
      body: {},
    });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(uploadMultipleImagesToCloudinary).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data.images.length).toBe(properties[0].images.length + 1);
  });

  it("removes images successfully", async () => {
    const removeUrl = properties[0].images[0];
    const req = mockRequest({
      params: { id: properties[0]._id },
      user: { _id: agent._id },
      body: { removeImages: JSON.stringify([removeUrl]) },
    });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(deleteImageFromCloudinary).toHaveBeenCalledWith(removeUrl);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data.images.length).toBe(0);
  });

  it("returns 500 if database throws error", async () => {
    jest.spyOn(Property.prototype, "save").mockImplementationOnce(() => { throw new Error("DB failure"); });
    const req = mockRequest({ params: { id: properties[0]._id }, user: { _id: agent._id } });
    const res = mockResponse();
    await updateProperty(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
