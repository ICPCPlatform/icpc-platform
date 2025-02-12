import crypto from "crypto";
import * as Helper from "./helper";

export function CodeforcesStanding(
  apiKey: string,
  apiSecret: string,
  contestId: number,
  handles: string[],
) {
  return {
    /**
     * Generates the API signature required by Codeforces.
     * This function computes a SHA-512 digest of a string composed of a salt, the request, and the API secret.
     * It returns a string in the format: &apiSig=123456<digest>
     *
     */
    getSignature(request: string): string {
      const salt = "123456";
      // The string to hash is of the form: "123456/<request>#<apiSecret>"
      const toHash = salt + "/" + request + "#" + apiSecret;
      const hash = crypto
        .createHash("sha512")
        .update(toHash, "ascii")
        .digest("hex")
        .toLowerCase();
      return "&apiSig=" + salt + hash;
    },

    constructURL(
      unofficial: boolean,
      from: number | undefined,
      count: number | undefined,
    ): string {
      let request = "contest.standings?";
      request += `apiKey=${apiKey}&contestId=${contestId}`;
      if (count != null) request += `&count=${count}`;

      if (from != null) request += `&from=${from}`;

      if (handles != null && handles.length > 0) {
        // Sort the handles alphabetically and join them with semicolons.
        handles.sort();
        request += `&handles=${handles.join(";")}`;
      }
      request += `&showUnofficial=${unofficial ? "true" : "false"}`;
      request += `&time=${Math.round(Date.now() / 1000)}`;
      // Append the signature computed from the request string.
      const url =
        "https://codeforces.com/api/" + request + this.getSignature(request);
      return url;
    },
    /**
     * Fetches the standings from Codeforces using the constructed URL.
     *
     */
    // public async getStanding(unofficial: boolean = false, from?: number, count?: number): Promise<any | null> {
    //   // TODO add option asManager check for more info @https://codeforces.com/apiHelp/methods#contest.standings
    //
    //   const url = this.constructURL(unofficial, from, count);
    //   const response = await Helper.getUrlResponse(url);
    //   // Assuming the API returns a JSON object with a "result" property.
    //   if (response != null) {
    //     return response["result"];
    //   }
    //   return null;
    // }
  };
}
