import { describe, it, expect } from "bun:test";
import {
  redactAuthHeader,
  redactSensitiveHeaders,
} from "../src/functions/redactAuthHeader";

describe("redactAuthHeader", () => {
  it("deve retornar string vazia quando authorization é undefined", () => {
    expect(redactAuthHeader(undefined)).toBe("");
  });

  it("deve retornar string vazia quando authorization é null", () => {
    expect(redactAuthHeader(null)).toBe("");
  });

  it("deve truncar token Bearer mantendo o esquema visível", () => {
    const result = redactAuthHeader("Bearer abcdefghijklmnopqrstuvwxyz");
    expect(result).toBe("Bearer abcdefghijkl…");
  });

  it("deve truncar token Basic", () => {
    const result = redactAuthHeader("Basic abcdefghijklmnopqrstuvwxyz");
    expect(result).toBe("Basic abcdefghijkl…");
  });

  it("deve truncar token sem esquema", () => {
    const result = redactAuthHeader("abcdefghijklmnopqrstuvwxyz");
    expect(result).toBe("abcdefghijkl…");
  });

  it("deve usar o primeiro item quando recebe array", () => {
    const result = redactAuthHeader(["Bearer abcdefghijklmnopqrstuvwxyz"]);
    expect(result).toBe("Bearer abcdefghijkl…");
  });
});

describe("redactSensitiveHeaders", () => {
  it("deve retornar objeto vazio quando headers é undefined", () => {
    expect(redactSensitiveHeaders(undefined)).toEqual({});
  });

  it("deve redactar authorization mas preservar outros headers", () => {
    const headers = {
      authorization: "Bearer abcdefghijklmnopqrstuvwxyz",
      "content-type": "application/json",
      "x-habitar-user-uid": "user-123",
    };
    const result = redactSensitiveHeaders(headers);
    expect(result.authorization).toBe("Bearer abcdefghijkl…");
    expect(result["content-type"]).toBe("application/json");
    expect(result["x-habitar-user-uid"]).toBe("user-123");
  });

  it("deve redactar cookie e api-key", () => {
    const headers = {
      cookie: "session=abcdefghijklmnopqrstuvwxyz",
      "x-api-key": "abcdefghijklmnopqrstuvwxyz",
    };
    const result = redactSensitiveHeaders(headers);
    expect(result.cookie).toBe("session=abcd…");
    expect(result["x-api-key"]).toBe("abcdefghijkl…");
  });

  it("deve ser case-insensitive ao detectar headers sensíveis", () => {
    const headers = {
      Authorization: "Bearer abcdefghijklmnopqrstuvwxyz",
    };
    const result = redactSensitiveHeaders(headers);
    expect(result.Authorization).toBe("Bearer abcdefghijkl…");
  });
});
