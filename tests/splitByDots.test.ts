import { describe, it, expect } from "bun:test";
import { splitByDots } from "../src/functions/splitByDots";

describe("splitByDots", () => {
  it("deve criar objeto com chave vazia quando field é string vazia", () => {
    const result = splitByDots("", "value");
    expect(result).toEqual({ "": "value" });
  });

  it("deve criar objeto simples com um nível", () => {
    const result = splitByDots("name", "John");
    expect(result).toEqual({ name: "John" });
  });

  it("deve criar objeto aninhado com dois níveis", () => {
    const result = splitByDots("user.name", "John");
    expect(result).toEqual({ user: { name: "John" } });
  });

  it("deve criar objeto aninhado com três níveis", () => {
    const result = splitByDots("user.address.city", "São Paulo");
    expect(result).toEqual({ user: { address: { city: "São Paulo" } } });
  });

  it("deve criar objeto aninhado com múltiplos níveis", () => {
    const result = splitByDots("a.b.c.d.e", "value");
    expect(result).toEqual({ a: { b: { c: { d: { e: "value" } } } } });
  });

  it("deve aceitar valores numéricos", () => {
    const result = splitByDots("count", 42);
    expect(result).toEqual({ count: 42 });
  });

  it("deve aceitar valores booleanos", () => {
    const result = splitByDots("isActive", true);
    expect(result).toEqual({ isActive: true });
  });

  it("deve aceitar valores null", () => {
    const result = splitByDots("data", null);
    expect(result).toEqual({ data: null });
  });

  it("deve aceitar valores undefined", () => {
    const result = splitByDots("value", undefined);
    expect(result).toEqual({ value: undefined });
  });

  it("deve aceitar objetos como valor", () => {
    const obj = { nested: "object" };
    const result = splitByDots("config", obj);
    expect(result).toEqual({ config: obj });
  });

  it("deve aceitar arrays como valor", () => {
    const arr = [1, 2, 3];
    const result = splitByDots("items", arr);
    expect(result).toEqual({ items: arr });
  });

  it("deve lidar com pontos múltiplos consecutivos", () => {
    const result = splitByDots("a..b", "value");
    expect(result).toEqual({ a: { "": { b: "value" } } });
  });

  it("deve lidar com field que começa com ponto", () => {
    const result = splitByDots(".name", "John");
    expect(result).toEqual({ "": { name: "John" } });
  });

  it("deve lidar com field que termina com ponto", () => {
    const result = splitByDots("name.", "John");
    expect(result).toEqual({ name: { "": "John" } });
  });
});

