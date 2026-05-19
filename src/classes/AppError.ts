import { ValidationError } from "class-validator"

export class AppError extends Error {
  public readonly message: string
  public readonly statusCode: number
  public readonly errors?: ValidationError[]
  public readonly code?: string

  constructor(message: string, statusCode = 400, errors?: ValidationError[], code?: string) {
    super(message)
    this.message = message
    this.statusCode = statusCode
    this.errors = errors
    this.code = code
  }
}
