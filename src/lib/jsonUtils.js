/**
 * Safely parse a JSON string.
 *
 * @param {string} input - Raw JSON string.
 * @returns {{ ok: true, value: any } | { ok: false, error: string }}
 *          ok:     true  → value is the parsed object
 *          ok:     false → error contains the message
 */
export function tryParse(input) {
  if (typeof input !== "string") {
    return { ok: false, error: "Input must be a string" };
  }

  try {
    const parsed = JSON.parse(input);
    return { ok: true, value: parsed };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Invalid JSON",
    };
  }
}
