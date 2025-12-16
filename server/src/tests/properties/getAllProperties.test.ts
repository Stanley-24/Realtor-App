import { mockRequest, mockResponse } from "../setup";
import Property from "../../models/property.model";
import { createTestData } from "./helpers/createProp";
import { getAllProperties } from "../../controllers/property.controller";

describe("getAllProperties", () => {
  let agent: any;
  let properties: any[];

  beforeEach(async () => {
    const data = await createTestData();
    agent = data.agent;
    properties = data.properties;
  });

  // ------------------ Basic Fetch ------------------
  it("returns all properties without filters", async () => {
    const req = mockRequest({ query: {} });
    const res = mockResponse();

    await getAllProperties(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: expect.any(Number),
        data: expect.any(Array),
      })
    );
  });

  // ------------------ Filters ------------------
  it("filters by type", async () => {
    const req = mockRequest({ query: { type: "House" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.length).toBe(1);
    expect(data[0].type).toBe("House");
  });

  it("filters by multiple types (House,Apartment)", async () => {
    const req = mockRequest({ query: { type: "House,Apartment" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const returnedTypes = res.json.mock.calls[0][0].data.map((p: any) => p.type);
    expect(returnedTypes).toEqual(expect.arrayContaining(["House", "Apartment"]));
    expect(returnedTypes).not.toContain("Commercial");
  });

  it("filters by location (regex)", async () => {
    const req = mockRequest({ query: { location: "lag" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const payload = res.json.mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(payload.data[0].location.toLowerCase()).toContain("lag");
  });

  it("filters by price range", async () => {
    const req = mockRequest({ query: { minPrice: "400000", maxPrice: "900000" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const properties = res.json.mock.calls[0][0].data;
    expect(properties.every((p: any) => p.price >= 400000 && p.price <= 900000)).toBe(true);
  });

  it("filters by status", async () => {
    const req = mockRequest({ query: { status: "Rented" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const props = res.json.mock.calls[0][0].data;
    expect(props.length).toBe(1);
    expect(props[0].status).toBe("Rented");
  });

  it("filters by isFeatured=true", async () => {
    const req = mockRequest({ query: { isFeatured: "true" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.length).toBe(1);
    expect(data[0].isFeatured).toBe(true);
    expect(data[0].title).toBe("Lagos House");
  });

  it("filters by isFeatured=false", async () => {
    const req = mockRequest({ query: { isFeatured: "false" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.every((p: any) => p.isFeatured === false)).toBe(true);
  });

  it("filters by bedrooms", async () => {
    const req = mockRequest({ query: { bedrooms: "3" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.length).toBe(1);
    expect(data[0].bedrooms).toBe(3);
  });

  it("filters by bathrooms", async () => {
    const req = mockRequest({ query: { bathrooms: "1" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const data = res.json.mock.calls[0][0].data;
    expect(data.length).toBe(1);
    expect(data[0].bathrooms).toBe(1);
  });

  // ------------------ Sorting ------------------
  it("sorts by price ascending", async () => {
    const req = mockRequest({ query: { sortBy: "price", order: "asc" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const prices = res.json.mock.calls[0][0].data.map((p: any) => p.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it("sorts by price descending", async () => {
    const req = mockRequest({ query: { sortBy: "price", order: "desc" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const prices = res.json.mock.calls[0][0].data.map((p: any) => p.price);
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  it("defaults sortBy to createdAt if invalid", async () => {
    const req = mockRequest({ query: { sortBy: "unknownField" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    expect(res.json.mock.calls[0][0].data.length).toBeGreaterThan(0);
  });

  // ------------------ Pagination ------------------
  it("returns paginated results", async () => {
    const req = mockRequest({ query: { page: "1", limit: "2" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    const body = res.json.mock.calls[0][0];
    expect(body.page).toBe(1);
    expect(body.limit).toBe(2);
    expect(body.data.length).toBeLessThanOrEqual(2);
  });

  it("returns page=1 when invalid page is sent", async () => {
    const req = mockRequest({ query: { page: "-1", limit: "2" } });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.json.mock.calls[0][0].page).toBe(1);
  });

  it("caps limit to MAX_PAGE_SIZE when too large", async () => {
    const req = mockRequest({ query: { page: "1", limit: "999999" } });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.json.mock.calls[0][0].limit).toBeLessThanOrEqual(100);
  });

  it("returns default limit=10 when invalid limit", async () => {
    const req = mockRequest({ query: { page: "1", limit: "0" } });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.json.mock.calls[0][0].limit).toBe(10);
  });

  // ------------------ Error Handling ------------------
  it("returns 400 for invalid type", async () => {
    const req = mockRequest({ query: { type: "Castle" } });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Invalid property type") })
    );
  });

  it("returns 400 for invalid status", async () => {
    const req = mockRequest({ query: { status: "Flying" } });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Invalid status") })
    );
  });

  it("returns empty array if no property matches", async () => {
    const req = mockRequest({ query: { location: "Mars" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body.count).toBe(0);
    expect(body.data).toHaveLength(0);
    expect(body.success).toBe(true);
  });

  it("handles invalid numeric filters gracefully", async () => {
    const req = mockRequest({ query: { minPrice: "abc", maxPrice: "xyz", bedrooms: "NaN" } });
    const res = mockResponse();

    await getAllProperties(req, res);

    expect(res.json.mock.calls[0][0].data.length).toBe(3);
  });

  it("populates agent fields correctly", async () => {
    const req = mockRequest({ query: {} });
    const res = mockResponse();

    await getAllProperties(req, res);

    const agents = res.json.mock.calls[0][0].data.map((p: any) => p.agent);
    expect(agents.every((a: any) => a.fullName && a.role)).toBe(true);
  });

  it("ignores unknown query parameters without breaking", async () => {
    const req = mockRequest({ query: { unknownParam: "xyz" } });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.json.mock.calls[0][0].data.length).toBe(3);
  });

  it("returns empty array if page exceeds total pages", async () => {
    const req = mockRequest({ query: { page: "1000", limit: "10" } });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.json.mock.calls[0][0].count).toBe(0);
    expect(res.json.mock.calls[0][0].data.length).toBe(0);
  });

  it("returns 500 if database throws an error", async () => {
    jest.spyOn(Property, "find").mockImplementationOnce(() => { throw new Error("DB failure"); });

    const req = mockRequest({ query: {} });
    const res = mockResponse();

    await getAllProperties(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Failed to fetch properties" }));
  });
});
