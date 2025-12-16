// server/src/tests/properties/getPropertiesById.test.ts

import { mockRequest, mockResponse } from "../setup";
import Property from "../../models/property.model";
import mongoose from "mongoose";
import { getPropertyById } from "../../controllers/property.controller";
import { createTestData } from "./helpers/createProp";

describe("getPropertyById", () => {
  let agent: any;
  let property: any;

  beforeEach(async () => {
   const data = await createTestData();
   agent = data.agent;
   property = data.properties[0];
  });

  it("returns property by valid ID", async () => {
    const req = mockRequest({ params: { id: property._id.toString() } });
    const res = mockResponse();

    await getPropertyById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.data._id.toString()).toBe(property._id.toString());
    expect(body.data.agent.fullName).toBe(agent.fullName);
    expect(body.data.agent.email).toBe(agent.email);
  });

  it("returns 400 for invalid property ID", async () => {
    const req = mockRequest({ params: { id: "123invalidid" } });
    const res = mockResponse();

    await getPropertyById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Invalid property ID",
      })
    );
  });

  it("returns 404 if property not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const req = mockRequest({ params: { id: nonExistentId.toString() } });
    const res = mockResponse();

    await getPropertyById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Property not found",
      })
    );
  });

  it("returns 500 if database throws an error", async () => {
    // mock Property.findById to throw
    jest.spyOn(Property, "findById").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const req = mockRequest({ params: { id: property._id.toString() } });
    const res = mockResponse();

    await getPropertyById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Failed to fetch property",
      })
    );
  });
});
