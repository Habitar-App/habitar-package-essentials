import { describe, it, expect } from "bun:test";
import { AppError } from "../src/classes/AppError";
import { ValidationError } from "class-validator";

describe("AppError", () => {
  it("deve criar uma instância de AppError com mensagem padrão", () => {
    const error = new AppError("Erro de teste");
    
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Erro de teste");
    expect(error.statusCode).toBe(400);
    expect(error.errors).toBeUndefined();
  });

  it("deve criar uma instância de AppError com statusCode customizado", () => {
    const error = new AppError("Erro não encontrado", 404);
    
    expect(error.message).toBe("Erro não encontrado");
    expect(error.statusCode).toBe(404);
  });

  it("deve criar uma instância de AppError com ValidationError", () => {
    const validationErrors: ValidationError[] = [
      {
        target: { name: "" },
        property: "name",
        value: "",
        constraints: { isNotEmpty: "name should not be empty" },
        children: [],
      },
    ];
    
    const error = new AppError("Erro de validação", 400, validationErrors);
    
    expect(error.message).toBe("Erro de validação");
    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual(validationErrors);
    expect(error.errors?.length).toBe(1);
  });

  it("deve herdar corretamente de Error", () => {
    const error = new AppError("Teste");
    
    expect(error.name).toBe("Error");
    expect(error.stack).toBeDefined();
  });
});

