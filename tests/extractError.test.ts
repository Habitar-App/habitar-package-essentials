import { describe, it, expect } from "bun:test";
import { extractError } from "../src/functions/extractError";
import { AppError } from "../src/classes/AppError";
import { ValidationError } from "class-validator";

describe("extractError", () => {
  it("deve retornar isOperational true para AppError", () => {
    const error = new AppError("Resource not found", 404);
    const result = extractError(error);

    expect(result.statusCode).toBe(404);
    expect(result.message).toBe("Resource not found");
    expect(result.errors).toEqual(["Resource not found"]);
    expect(result.isOperational).toBe(true);
  });

  it("deve achatar validation errors aninhados", () => {
    const validationErrors: ValidationError[] = [
      Object.assign(new ValidationError(), {
        property: "address",
        children: [
          Object.assign(new ValidationError(), {
            property: "city",
            constraints: { isString: "city must be a string" },
            children: [],
          }),
        ],
      }),
    ];
    const error = new AppError("Validation failed", 400, validationErrors);

    const result = extractError(error);
    expect(result.errors).toContain("address.city must be a string");
  });

  it("deve marcar erro genérico como não operacional com status 500", () => {
    const error = new Error("Something broke");
    const result = extractError(error);

    expect(result.statusCode).toBe(500);
    expect(result.isOperational).toBe(false);
    expect(result.message).toBe("Something broke");
  });

  it("deve extrair erro de axios com response", () => {
    const axiosError = {
      isAxiosError: true,
      message: "Request failed with status code 401",
      response: {
        status: 401,
        data: { message: "Unauthorized", errors: ["Invalid token"] },
      },
    };

    const result = extractError(axiosError);
    expect(result.statusCode).toBe(401);
    expect(result.message).toBe("Unauthorized");
    expect(result.errors).toEqual(["Invalid token"]);
    expect(result.isOperational).toBe(true);
  });

  it("deve usar 503 quando axios error não tem response", () => {
    const axiosError = {
      isAxiosError: true,
      message: "Network Error",
    };

    const result = extractError(axiosError);
    expect(result.statusCode).toBe(503);
    expect(result.isOperational).toBe(false);
  });
});
