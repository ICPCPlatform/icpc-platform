export class Helper {
    /**
     * Converts a byte array to a hexadecimal string.
     * @param byteArray An array of numbers or a Uint8Array representing bytes.
     * @returns A hexadecimal string representation of the byte array.
     */
    static toHexString(byteArray: number[] | Uint8Array): string {
      return Array.from(byteArray, byte =>
        ("0" + (byte & 0xff).toString(16)).slice(-2)
      ).join("");
    }
  
    /**
     * Fetches a URL using the specified HTTP method and returns the parsed JSON response.
     * @param url The URL to fetch.
     * @param httpMethod The HTTP method to use (defaults to "GET").
     * @returns A Promise resolving to the parsed JSON response or null if an error occurs.
     */
    static async getUrlResponse(url: string, httpMethod: string = "GET"): Promise<any | null> {
      try {
        const response = await fetch(url, { method: httpMethod });
        if (!response.ok) {
          console.error("Error fetching URL:", response.statusText);
          return null;
        }
        return await response.json();
      } catch (error) {
        console.error("Exception occurred while fetching URL:", error);
        return null;
      }
    }
  }
  