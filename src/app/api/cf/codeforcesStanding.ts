import crypto from "crypto";
import { Helper } from "./helper"; 

export class CodeforcesStanding {
  private apiKey: string;
  private apiSecret: string;
  private contestId: number;
  private handles: string[];

  constructor(apiKey: string, apiSecret: string, contestId: number, handles: string[]) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.contestId = contestId;
    this.handles = handles;
  }

  /**
   * Generates the API signature required by Codeforces.
   * This function computes a SHA-512 digest of a string composed of a salt, the request, and the API secret.
   * It returns a string in the format: &apiSig=123456<digest>
   *
   * @param request The API request string.
   * @returns The computed API signature.
   */
  private getSignature(request: string): string {
    const salt = "123456";
    // The string to hash is of the form: "123456/<request>#<apiSecret>"
    const toHash = salt + "/" + request + "#" + this.apiSecret;
    const hash = crypto.createHash("sha512").update(toHash, "ascii").digest("hex").toLowerCase();
    return "&apiSig=" + salt + hash;
  }

  /**
   * Constructs the complete Codeforces API URL for fetching contest standings.
   *
   * @param unofficial Whether to include unofficial standings.
   * @param from (Optional) The starting rank (1-indexed).
   * @param count (Optional) The number of standings to fetch.
   * @returns The fully constructed URL.
   */
  public constructURL(unofficial: boolean, from?: number, count?: number): string {
    let request = "contest.standings?";
    request += `apiKey=${this.apiKey}&contestId=${this.contestId}`;
    if (count != null) {
      request += `&count=${count}`;
    }
    if (from != null) {
      request += `&from=${from}`;
    }
    if (this.handles != null && this.handles.length > 0) {
      // Sort the handles alphabetically and join them with semicolons.
      this.handles.sort();
      request += `&handles=${this.handles.join(";")}`;
    }
    request += `&showUnofficial=${unofficial ? "true" : "false"}`;
    request += `&time=${Math.round(Date.now() / 1000)}`;
    // Append the signature computed from the request string.
    const url = "https://codeforces.com/api/" + request + this.getSignature(request);
    return url;
  }

  /**
   * Fetches the standings from Codeforces using the constructed URL.
   *
   * @param unofficial (Optional) Whether to include unofficial standings (default false).
   * @param from (Optional) The starting rank.
   * @param count (Optional) The number of standings to fetch.
   * @returns A promise resolving to the result data from Codeforces or null if an error occurs.
   */
  public async getStanding(unofficial: boolean = false, from?: number, count?: number): Promise<any | null> {
    // TODO add option asManager check for more info @https://codeforces.com/apiHelp/methods#contest.standings
    
    const url = this.constructURL(unofficial, from, count);
    const response = await Helper.getUrlResponse(url);
    // Assuming the API returns a JSON object with a "result" property.
    if (response != null) {
      return response["result"];
    }
    return null;
  }
}
