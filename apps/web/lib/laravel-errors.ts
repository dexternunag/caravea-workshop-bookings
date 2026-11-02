export type FieldErrors = Record<string, string[]>;

export function mapLaravelValidationErrors(payload: unknown): FieldErrors {
  if (!isRecord(payload) || !isRecord(payload.errors)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(payload.errors).flatMap(([field, messages]) => {
      if (!Array.isArray(messages) || !messages.every((message) => typeof message === "string")) {
        return [];
      }

      return [[field, messages]];
    }),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
