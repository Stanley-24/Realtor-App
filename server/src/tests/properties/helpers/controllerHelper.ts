// server/src/tests/properties/helpers/controllerHelper.ts
import { Response } from "express";

/**
 * Typed mock for Express response
 */
export type MockResponse = Response & {
  status: jest.Mock<MockResponse, [number]>;
  json: jest.Mock<MockResponse, [any]>;
  send: jest.Mock<MockResponse, [any]>;
  sendStatus: jest.Mock<MockResponse, [number]>;
};

/**
 * Create a mock Express request
 */
export const mockRequest = (data: any = {}): any => ({
  body: data.body || {},
  params: data.params || {},
  query: data.query || {},
  files: data.files || [],
  user: data.user || null,
});

/**
 * Create a typed mock Express response with spies
 */
export const mockResponse = (): MockResponse => {
  const res = {} as MockResponse;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);

  return res;
};
