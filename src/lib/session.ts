import "server-only";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

// Encrypting a payload
//
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
/**
 * User session data type definition
 * 
 * @description Contains essential user information stored in encrypted sessions
 */
export type userData = {
  /** Unique identifier for the user */
  userId: number;
  /** User's chosen username */
  username: string;
  /** User's role in the system (e.g., 'admin', 'user', 'mentor') */
  role: string;
};

/**
 * Encrypts user session data into a JWT token
 * 
 * @param data - User data to encrypt in the session
 * @returns Promise resolving to encrypted JWT session string
 * 
 * @description
 * Creates a signed JWT token containing user session data with:
 * - 7-day expiration time
 * - HS256 algorithm for signing
 * - Issued at timestamp for validation
 * 
 * @example
 * ```typescript
 * const sessionToken = await encryptSession({
 *   userId: 123,
 *   username: "johndoe",
 *   role: "user"
 * });
 * ```
 */
export async function encryptSession(data: userData) {
  const session = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
  return session;
}

/**
 * Decrypts and validates a JWT session token
 * 
 * @param session - Encrypted JWT session string or undefined
 * @returns Promise resolving to decrypted user data or null if invalid
 * 
 * @description
 * Verifies and decrypts a JWT session token to extract user data.
 * Returns null for invalid, expired, or missing tokens.
 * Uses HS256 algorithm for verification against the secret key.
 * 
 * @note This function doesn't access cookies directly - session parameter must be extracted separately
 * 
 * @example
 * ```typescript
 * const userData = await decryptSession(sessionToken);
 * if (userData) {
 *   console.log(`User: ${userData.username}, Role: ${userData.role}`);
 * }
 * ```
 * 
 * @returns Object with userId, username, and role properties, or null if decryption fails
 */
export async function decryptSession(
  session: string | undefined,
): Promise<(JWTPayload & userData) | null> {
  if (!session) return null;

  // bad
  const { payload } = (await jwtVerify(session, encodedKey, {
    algorithms: ["HS256"],
  }).catch(() => {
    return {
      payload: null,
    };
  })) as { payload: (JWTPayload & userData) | null };

  return payload;
}
