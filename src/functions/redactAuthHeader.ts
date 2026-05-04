const PREVIEW_LENGTH = 12;

const truncate = (value: string): string => {
  if (value.length <= PREVIEW_LENGTH) return `${value.slice(0, Math.min(value.length, 6))}…`;
  return `${value.slice(0, PREVIEW_LENGTH)}…`;
};

export const redactAuthHeader = (
  authorization: string | string[] | undefined | null
): string => {
  if (!authorization) return "";
  const value = Array.isArray(authorization) ? authorization[0] : authorization;
  if (typeof value !== "string") return "";

  const [scheme, ...rest] = value.split(" ");
  const token = rest.join(" ");
  if (!token) return truncate(scheme);
  return `${scheme} ${truncate(token)}`;
};

const SENSITIVE_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "api-key",
  "x-auth-token",
]);

export const redactSensitiveHeaders = <T extends Record<string, any>>(
  headers: T | undefined
): Record<string, any> => {
  if (!headers) return {};
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (SENSITIVE_HEADERS.has(key.toLowerCase())) {
      out[key] = redactAuthHeader(value);
    } else {
      out[key] = value;
    }
  }
  return out;
};
