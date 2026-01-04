import { describe, it, expect } from "bun:test";
import { IsValidZipCode } from "../src/decorators/ValidateZipCode";
import { validate } from "class-validator";
import { IsString } from "class-validator";

class TestClass {
  @IsString()
  @IsValidZipCode()
  zipCode!: string;
}

describe("IsValidZipCode", () => {
  it("deve validar CEP válido com 8 dígitos", async () => {
    const instance = new TestClass();
    instance.zipCode = "01310100";
    
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("deve validar CEP válido com formatação", async () => {
    const instance = new TestClass();
    instance.zipCode = "01310-100";
    
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("deve rejeitar CEP inválido", async () => {
    const instance = new TestClass();
    instance.zipCode = "123";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe("zipCode");
    expect(errors[0].constraints).toBeDefined();
  });

  it("deve rejeitar CEP com menos de 8 dígitos", async () => {
    const instance = new TestClass();
    instance.zipCode = "1234567";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("deve rejeitar CEP com mais de 8 dígitos", async () => {
    const instance = new TestClass();
    instance.zipCode = "123456789";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("deve rejeitar CEP com caracteres não numéricos", async () => {
    const instance = new TestClass();
    instance.zipCode = "01310-ABC";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("deve rejeitar string vazia", async () => {
    const instance = new TestClass();
    instance.zipCode = "";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("deve validar diferentes CEPs válidos", async () => {
    const validCeps = ["01310100", "20040020", "04567890"];
    
    for (const cep of validCeps) {
      const instance = new TestClass();
      instance.zipCode = cep;
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    }
  });

  it("deve aceitar mensagem customizada de validação", async () => {
    class CustomMessageClass {
      @IsString()
      @IsValidZipCode({ message: "CEP inválido" })
      zipCode!: string;
    }

    const instance = new CustomMessageClass();
    instance.zipCode = "123";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });
});

