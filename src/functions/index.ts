import { mergeObjects } from "./mergeObjects";
import { splitByDots } from "./splitByDots";
import { extractError, ExtractedError } from "./extractError";
import { redactAuthHeader, redactSensitiveHeaders } from "./redactAuthHeader";

export type { ExtractedError };
export {
  mergeObjects,
  splitByDots,
  extractError,
  redactAuthHeader,
  redactSensitiveHeaders,
};
