import { mockRequest, mockResponse } from "../setup";
import { getMyListings } from "../../controllers/property.controller";
import { createTestData } from "./helpers/createProp";
import Property from "../../models/property.model";

describe("getMyListings", () => {
  let agent: any;
  let properties: any[];

  beforeEach(async () => {
    const data = await createTestData();
    agent = data.agent;
    properties = data.properties;
  });

  it("returns 401 if user is not authenticated", async () => {
    const req = mockRequest({ query: {} });
    const res = mockResponse();

    await getMyListings(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "User not authenticated" })
    );
  });

  it("returns all listings for authenticated agent", async () => {
    const req = mockRequest({ query: {}, user: { _id: agent._id } });
    const res = mockResponse();

    await getMyListings(req, res);

    const body = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(body.success).toBe(true);
    expect(body.count).toBe(properties.length);
    expect(body.data.length).toBe(properties.length);
    expect(body.data.every((p: any) => p.agent._id.toString() === agent._id.toString())).toBe(true);
  });

  it("filters by type", async () => {
    const req = mockRequest({ query: { type: "House" }, user: { _id: agent._id } });
    const res = mockResponse();

    await getMyListings(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.every((p: any) => p.type === "House")).toBe(true);
  });

  it("returns 400 for invalid type", async () => {
    const req = mockRequest({ query: { type: "Castle" }, user: { _id: agent._id } });
    const res = mockResponse();

    await getMyListings(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: expect.stringContaining("Invalid property type") })
    );
  });

  it("filters by status", async () => {
    const req = mockRequest({ query: { status: "Rented" }, user: { _id: agent._id } });
    const res = mockResponse();

    await getMyListings(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.every((p: any) => p.status === "Rented")).toBe(true);
  });

  it("returns 400 for invalid numeric filters", async () => {
    const req = mockRequest({
      query: { minPrice: "abc", maxPrice: "xyz" },
      user: { _id: agent._id },
    });
    const res = mockResponse();

    await getMyListings(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "minPrice and maxPrice must be valid numbers" })
    );
  });

  it("returns 404 if agent has no listings", async () => {
    const req = mockRequest({ query: {}, user: { _id: "000000000000000000000000" } });
    const res = mockResponse();

    await getMyListings(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "You haven’t published any listings yet." })
    );
  });

  it("returns 404 if filters yield no results", async () => {
    const req = mockRequest({ query: { location: "Mars" }, user: { _id: agent._id } });
    const res = mockResponse();

    await getMyListings(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "No listings found matching your search filters." })
    );
  });

  it("handles sorting and pagination", async () => {
    const req = mockRequest({
      query: { sort: "-price", page: "1", limit: "2" },
      user: { _id: agent._id },
    });
    const res = mockResponse();

    await getMyListings(req, res);

    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(2);
    expect(body.data.length).toBeLessThanOrEqual(2);

    // check descending price
    const prices = body.data.map((p: any) => p.price);
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  it("returns 500 if database throws an error", async () => {
    jest.spyOn(Property, "find").mockImplementationOnce(() => { throw new Error("DB failure"); });

    const req = mockRequest({ query: {}, user: { _id: agent._id } });
    const res = mockResponse();

    await getMyListings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Failed to fetch agent listings. Please try again later." })
    );
  });

  it("filters by location", async () => {
    // Assuming one of the test properties has location "123 Main St"
    const req = mockRequest({ query: { location: "Abuja" }, user: { _id: agent._id } });
    const res = mockResponse();

    await getMyListings(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((p: any) => p.location.toLowerCase().includes("abuja"))).toBe(true);
  });
});
