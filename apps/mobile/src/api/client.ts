// The whole app talks to the backend only through src/api/*. Today those
// modules read from a mock database (./mockDb.ts); swapping in a real server
// means replacing the bodies here with fetch() calls and keeping the
// signatures, so no screen or store has to change.

/** Errors screens are expected to catch and surface to the user. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const LATENCY_MS = 320;

/** Resolves after a plausible round-trip so loading states get exercised. */
export function delay<T>(value: T, ms: number = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function fail(message: string, code: string, ms: number = LATENCY_MS): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new ApiError(message, code)), ms));
}

/** Narrows an unknown catch value to a message safe to show to the user. */
export function messageOf(error: unknown, fallback = 'Щось пішло не так. Спробуйте ще раз.'): string {
  return error instanceof ApiError ? error.message : fallback;
}
