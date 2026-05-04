import { AppError } from "./classes";

import { IsValidPhone } from "./decorators";
import { IsValidZipCode } from "./decorators";
import { AutoValidate } from "./decorators";

import { mergeObjects } from "./functions";
import { splitByDots } from "./functions";
import { extractError } from "./functions";
import { redactAuthHeader } from "./functions";
import { redactSensitiveHeaders } from "./functions";
import type { ExtractedError } from "./functions";

import { logger } from "./logs";

export type { ExtractedError };
export {
  AppError,
  IsValidPhone,
  IsValidZipCode,
  AutoValidate,
  mergeObjects,
  splitByDots,
  extractError,
  redactAuthHeader,
  redactSensitiveHeaders,
  logger,
};
