import { JWTPayload, KeyLike, SignJWT, jwtVerify } from "jose";
import { JWTOptions } from "next-auth/jwt";

// Encrypting a payload
//
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
export type userData = {
  userId: number;
  username: string;
  role: string;
};

export async function encryptSession(data: userData) {
  const session = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
  return session;
}

/** Decrypting a payload it doesn't access cookies
  * return a `{ userId: string, username: string, role: string }` object 
  */
export async function decryptSession(
  session: string | undefined,
): Promise<(JWTPayload & userData) | null> {

  if (!session) return null;

  // bad
  const { payload }: { payload: any } = await jwtVerify(session, encodedKey, {
    algorithms: ["HS256"],
  }).catch((_error) => {
    return {
      payload: null,
    };
  });

  return payload;
}
