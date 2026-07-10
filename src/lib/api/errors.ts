export function extractErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "object") {
    const anyErr = err as Record<string, unknown>;
    if (typeof anyErr.message === "string") return anyErr.message;
    const data = anyErr.data as Record<string, unknown> | undefined;
    if (data && typeof data.message === "string") return data.message;
  }
  return fallback;
}
