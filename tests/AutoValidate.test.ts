import { describe, it, expect } from "bun:test";
import { AutoValidate } from "../src/decorators/AutoValidate";
import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";
import { AppError } from "../src/classes/AppError";

@AutoValidate
class ValidatedClass {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@AutoValidate
class SimpleClass {
  @IsString()
  @IsNotEmpty()
  value!: string;
}

describe("AutoValidate", () => {
  it("deve lançar AppError quando validação falha na criação", () => {
    expect(() => {
      new ValidatedClass();
    }).toThrow(AppError);
  });

  it("deve lançar AppError com statusCode 400", () => {
    try {
      new ValidatedClass();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      if (error instanceof AppError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Fail when validate the class ValidatedClass");
        expect(error.errors).toBeDefined();
        expect(error.errors?.length).toBeGreaterThan(0);
      }
    }
  });

  it("deve validar múltiplos campos na criação", () => {
    try {
      new ValidatedClass();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      if (error instanceof AppError) {
        expect(error.errors?.length).toBeGreaterThan(0);
      }
    }
  });

  it("deve lançar erro para classe simples com valor inválido", () => {
    expect(() => {
      new SimpleClass();
    }).toThrow(AppError);
  });

  it("deve validar que o decorator aplica validação no construtor", () => {
    let errorCaught = false;
    try {
      new ValidatedClass();
    } catch (error) {
      errorCaught = true;
      expect(error).toBeInstanceOf(AppError);
    }
    expect(errorCaught).toBe(true);
  });
});

