/**
 * Parse fetch Response body as JSON without throwing on empty or invalid bodies
 * (avoids "Unexpected end of JSON input" in the browser console).
 */
export async function parseResponseJson<T>(res: Response): Promise<
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; empty: boolean }
> {
  const text = await res.text()
  if (!text.trim()) {
    return {
      ok: false,
      status: res.status,
      empty: true,
      error: res.ok ? 'Empty response from server.' : `Request failed (${res.status}).`,
    }
  }
  try {
    return { ok: true, data: JSON.parse(text) as T }
  } catch {
    return {
      ok: false,
      status: res.status,
      empty: false,
      error: 'Invalid JSON from server.',
    }
  }
}
