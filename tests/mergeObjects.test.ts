import { describe, it, expect } from "bun:test";
import { mergeObjects } from "../src/functions/mergeObjects";

describe("mergeObjects", () => {
  it("deve retornar undefined quando nenhum objeto é passado", () => {
    const result = mergeObjects();
    expect(result).toBeUndefined();
  });

  it("deve retornar o objeto quando apenas um objeto é passado", () => {
    const obj = { a: 1, b: 2 };
    const result = mergeObjects(obj);
    expect(result).toEqual(obj);
  });

  it("deve mesclar dois objetos simples", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3, d: 4 };
    const result = mergeObjects(obj1, obj2);
    
    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("deve sobrescrever propriedades quando há conflito", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = mergeObjects(obj1, obj2);
    
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("deve mesclar objetos aninhados profundamente", () => {
    const obj1 = { a: { b: { c: 1 } } };
    const obj2 = { a: { b: { d: 2 } } };
    const result = mergeObjects(obj1, obj2);
    
    expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
  });

  it("deve ignorar valores undefined no objeto de entrada", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: undefined, c: 3 };
    const result = mergeObjects(obj1, obj2);
    
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("não deve ignorar valores null no objeto de entrada", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: null, c: 3 };
    const result = mergeObjects(obj1, obj2);
    
    expect(result).toEqual({ a: 1, b: null, c: 3 });
  });

  it("deve mesclar múltiplos objetos", () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const obj3 = { c: 3 };
    const result = mergeObjects(obj1, obj2, obj3);
    
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("deve sobrescrever valores em ordem de precedência (último vence)", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    const obj3 = { a: 3 };
    const result = mergeObjects(obj1, obj2, obj3);
    
    expect(result).toEqual({ a: 3 });
  });

  it("deve retornar o primeiro objeto quando o segundo é null", () => {
    const obj1 = { a: 1, b: 2 };
    const result = mergeObjects(obj1, null);
    
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("deve retornar o segundo objeto quando o primeiro é null", () => {
    const obj2 = { a: 1, b: 2 };
    const result = mergeObjects(null, obj2);
    
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("deve mesclar arrays como valores simples (não mescla arrays)", () => {
    const obj1 = { items: [1, 2] };
    const obj2 = { items: [3, 4] };
    const result = mergeObjects(obj1, obj2);
    
    expect(result).toEqual({ items: [3, 4] });
  });

  it("deve mesclar objetos complexos com múltiplos níveis", () => {
    const obj1 = {
      user: {
        name: "John",
        address: {
          street: "Main St",
          number: 123,
        },
      },
      settings: {
        theme: "dark",
      },
    };
    
    const obj2 = {
      user: {
        address: {
          city: "São Paulo",
        },
        age: 30,
      },
      settings: {
        language: "pt-BR",
      },
    };
    
    const result = mergeObjects(obj1, obj2);
    
    expect(result).toEqual({
      user: {
        name: "John",
        address: {
          street: "Main St",
          number: 123,
          city: "São Paulo",
        },
        age: 30,
      },
      settings: {
        theme: "dark",
        language: "pt-BR",
      },
    });
  });
});

