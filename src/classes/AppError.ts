import { ValidationError } from "class-validator"

export class AppError extends Error {
  public readonly message: string
  public readonly statusCode: number
  public readonly errors?: ValidationError[]

  constructor(message: string, statusCode = 400, errors?: ValidationError[]) {
    super(message)
    this.message = message
    this.statusCode = statusCode
    this.errors = errors
  }
}
