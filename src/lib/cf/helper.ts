/**
 * Converts a byte array to a hexadecimal string.
 */
export function toHexString(byteArray: number[] | Uint8Array): string {
  return Array.from(byteArray, (byte) =>
    ("0" + (byte & 0xff).toString(16)).slice(-2),
  ).join("");
}

/**
 * Fetches a URL using the specified HTTP method and returns the parsed JSON response.
 */
// export async function getUrlResponse(
//   url: string,
//   httpMethod: string = "GET",
// ): Promise<any | null> {
//   try {
//     const response = await fetch(url, { method: httpMethod });
//     if (!response.ok) {
//       console.error("Error fetching URL:", response.statusText);
//       return null;
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Exception occurred while fetching URL:", error);
//     return null;
//   }
// }
