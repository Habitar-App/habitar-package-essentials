import { describe, it, expect } from "bun:test";
import { IsValidPhone } from "../src/decorators/ValidatePhone";
import { validate } from "class-validator";
import { IsString } from "class-validator";

class TestClass {
  @IsString()
  @IsValidPhone()
  phone!: string;
}

describe("IsValidPhone", () => {
  it("deve validar telefone válido", async () => {
    const instance = new TestClass();
    instance.phone = "11987654321";
    
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("deve rejeitar telefone inválido", async () => {
    const instance = new TestClass();
    instance.phone = "123";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe("phone");
    expect(errors[0].constraints).toBeDefined();
  });

  it("deve rejeitar telefone muito curto", async () => {
    const instance = new TestClass();
    instance.phone = "12345";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("deve validar telefone com DDD", async () => {
    const instance = new TestClass();
    instance.phone = "21987654321";
    
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("deve validar telefone celular", async () => {
    const instance = new TestClass();
    instance.phone = "11999887766";
    
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("deve validar telefone fixo", async () => {
    const instance = new TestClass();
    instance.phone = "1134567890";
    
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it("deve rejeitar string vazia", async () => {
    const instance = new TestClass();
    instance.phone = "";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("deve aceitar mensagem customizada de validação", async () => {
    class CustomMessageClass {
      @IsString()
      @IsValidPhone({ message: "Telefone inválido" })
      phone!: string;
    }

    const instance = new CustomMessageClass();
    instance.phone = "123";
    
    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });
});

