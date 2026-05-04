import { ValidationError } from "class-validator";
import { AppError } from "../classes/AppError";

export type ExtractedError = {
  message: string;
  errors: string[];
  statusCode: number;
  isOperational: boolean;
  stack?: string;
};

const flattenValidationErrors = (errors: ValidationError[]): string[] => {
  const out: string[] = [];

  const walk = (error: ValidationError, path: string = "") => {
    const currentPath = path ? `${path}.${error.property}` : error.property;

    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        out.push((message as string).replace(error.property, currentPath));
      }
    }

    if (error.children?.length) {
      error.children.forEach((child) => walk(child, currentPath));
    }
  };

  errors.forEach((error) => walk(error));
  return out;
};

const truncate = (text: string, max = 240): string => {
  const sanitized = text.replace(/(\r\n|\n|\r)/gm, " ");
  return sanitized.length > max ? `${sanitized.slice(0, max)}…` : sanitized;
};

const isAxiosError = (error: unknown): error is {
  isAxiosError: boolean;
  message: string;
  response?: { status?: number; data?: any };
  config?: { url?: string; method?: string };
  stack?: string;
} => {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { isAxiosError?: boolean }).isAxiosError === true
  );
};

export const extractError = (error: unknown): ExtractedError => {
  if (error instanceof AppError) {
    const errors = error.errors?.length
      ? flattenValidationErrors(error.errors)
      : [error.message];

    return {
      message: truncate(error.message),
      errors,
      statusCode: error.statusCode,
      isOperational: true,
      stack: error.stack,
    };
  }

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 503;
    const data = error.response?.data;
    const message =
      (typeof data === "object" && data?.message) ||
      error.message ||
      "Upstream request failed";
    const errors: string[] = Array.isArray(data?.errors)
      ? data.errors
      : [message];

    return {
      message: truncate(message),
      errors,
      statusCode: status,
      isOperational: status < 500,
      stack: error.stack,
    };
  }

  const fallback = error as Error;
  const message = fallback?.message || "Internal server error";

  return {
    message: truncate(message),
    errors: [message],
    statusCode: 500,
    isOperational: false,
    stack: fallback?.stack,
  };
};
