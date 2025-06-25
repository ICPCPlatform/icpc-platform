"use client";

import { useTrainingContext } from "@/providers/training";

export default function Page() {
  const training = useTrainingContext();
  const leaderboard = training?.leaderboard || [];
  const standingView = training?.standingView || [];

  if (!leaderboard.length || !standingView.length) {
    return (
      <div>
        <h1>Leaderboard</h1>
        <p>No leaderboard data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border rounded">
          <thead>
            <tr>
              {standingView.map((field) => (
                <th key={field} className="border px-4 py-2 text-left capitalize">
                  {field}
                </th>
              ))}
              <th className="border px-4 py-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={user.userId || idx}>
                {standingView.map((field) => (
                  <td key={field} className="border px-4 py-2">
                    {user[field] !== undefined && user[field] !== null && user[field] !== "" ? user[field] : "-"}
                  </td>
                ))}
                <td className="border px-4 py-2 font-bold">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

