// import { CodeforcesStanding } from "./codeforcesStanding"; // adjust path accordingly
//
// // A small delay helper function using a Promise.
// const sleep = (ms: number): Promise<void> =>
//   new Promise((resolve) => setTimeout(resolve, ms));
//
// /**
//  * Returns the complete standing for a contest along with the number of problems.
//  * For every handle, the returned array’s index 0 contains the total number of solved problems,
//  * and indices 1 to n indicate whether the corresponding problem is solved (true/false).
//  *
//  */
// export async function getStandingFromCodeforces(
//   contestId: number | string,
//   handles: string[],
//   apiKey: string,
//   apiSecret: string
// ): Promise<[Record<string, (number | boolean)[]>, number] | null> {
//   // Convert contestId to a number
//   const contestIdInt =
//     typeof contestId === "string" ? parseInt(contestId) : contestId;
//   if (isNaN(contestIdInt)) {
//     return null;
//   }
//
//   const result = await getStandingRowsFromCodeforces(
//     contestIdInt,
//     true,
//     handles,
//     apiKey,
//     apiSecret
//   );
//   if (!result || result.length === 0 || result[0] == null) {
//     console.log("failed", result);
//     return null;
//   }
//
//   const numberOfProblems = result[0]["problemResults"].length;
//   // Create a set of handles (in lowercase) for quick lookup.
//   const ourTrainees = new Set(handles.map((handle) => handle.toLowerCase()));
//
//   // We'll store the standing as an object where each key (handle) maps to an array.
//   // The first element (index 0) is the total number of problems solved (number),
//   // while indices 1..numberOfProblems are booleans indicating if the problem is solved.
//   const standing: Record<string, (number | boolean)[]> = {};
//   // Create a template array: index 0 is 0 (total solved) and others are false.
//   const templateArray: (number | boolean)[] = [0];
//   for (let i = 0; i < numberOfProblems; i++) {
//     templateArray.push(false);
//   }
//
//   for (const row of result) {
//     const handleFromRow = row?.party?.members?.[0]?.handle;
//     if (typeof handleFromRow !== "string") continue;
//     const lowerHandle = handleFromRow.toLowerCase();
//     if (!ourTrainees.has(lowerHandle)) {
//       continue;
//     }
//     if (!standing[lowerHandle]) {
//       // Use a shallow copy of the template array.
//       standing[lowerHandle] = templateArray.slice();
//     }
//     const problemResults = row["problemResults"];
//     if (!Array.isArray(problemResults)) continue;
//     for (let j = 0; j < numberOfProblems; j++) {
//       if (problemResults[j]["points"] > 0.0) {
//         if (standing[lowerHandle][j + 1] === false) {
//           standing[lowerHandle][j + 1] = true;
//           standing[lowerHandle][0] = (standing[lowerHandle][0] as number) + 1;
//         }
//       }
//     }
//   }
//   return [standing, numberOfProblems];
// }
//
// /**
//  * Retrieves the standing rows from Codeforces.
//  * It first attempts to fetch the standings normally. If that fails, it falls back to a pagination method.
//  */
// export async function getStandingRowsFromCodeforces(
//   contestId: number | string,
//   unofficial: boolean,
//   handles: string[],
//   apiKey: string,
//   apiSecret: string
// ): Promise<any[] | null> {
//   console.log(
//     `contestId = ${contestId}, unofficial = ${unofficial}, handles = ${handles}, apiKey = ${apiKey}, apiSecret = ${apiSecret}`
//   );
//   const contestIdInt =
//     typeof contestId === "string" ? parseInt(contestId) : contestId;
//   const codeforces = new CodeforcesStanding(
//     apiKey,
//     apiSecret,
//     contestIdInt,
//     handles
//   );
//
//   const result = await codeforces.getStanding(unofficial, undefined, undefined);
//   if (result != null) {
//     return result["rows"];
//   }
//   // If the initial attempt fails, wait one second and try pagination.
//   await sleep(1000);
//   return getStandingRowsFromCodeforcesWithPagination(
//     contestIdInt,
//     unofficial,
//     apiKey,
//     apiSecret
//   );
// }
//
// /**
//  * Retrieves Codeforces standing rows using pagination.
//  * It repeatedly fetches batches of rows until no more rows are returned.
//  *
//  */
// export async function getStandingRowsFromCodeforcesWithPagination(
//   contestId: number | string,
//   unofficial: boolean,
//   apiKey: string,
//   apiSecret: string
// ): Promise<any[]> {
//   const contestIdInt =
//     typeof contestId === "string" ? parseInt(contestId) : contestId;
//   // Note: When paginating, we don’t need to filter by handles.
//   const codeforces = new CodeforcesStanding(
//     apiKey,
//     apiSecret,
//     contestIdInt,
//     []
//   );
//   const count = 5000;
//   let rows: any[] = [];
//   for (let i = 1; ; i += count) {
//     await sleep(100);
//     const result = await codeforces.getStanding(unofficial, i, count);
//     if (!result || !result["rows"] || result["rows"].length === 0) {
//       break;
//     }
//     rows = rows.concat(result["rows"]);
//   }
//   return rows;
// }
