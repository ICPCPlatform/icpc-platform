import { getTrainingFullData } from "@/dao/getTrainingFullData";
import { db } from "@/lib/db";
import { Trainings, type StandingView } from "@/lib/db/schema/training/Trainings";
import { eq } from "drizzle-orm";
import { getUserData } from "@/lib/session";
import { notFound } from "next/navigation";

async function getStandingViewConfig(trainingId: number): Promise<StandingView[]> {
  const result = await db
    .select({ standingView: Trainings.standingView })
    .from(Trainings)
    .where(eq(Trainings.trainingId, trainingId))
    .execute();
  
  return result[0]?.standingView || ["name", "cfHandle", "level"];
}

export default async function Page({ params }: { params: Promise<{ trainingId: string }> }) {
  const user = await getUserData();
  if (!user) {
    notFound();
  }

  const { trainingId: trainingIdStr } = await params;
  const trainingId = parseInt(trainingIdStr);
  const training = await getTrainingFullData({ trainingId, userId: user.userId });
  const standingView = await getStandingViewConfig(trainingId);
  
  const leaderboard = training?.leaderBoard || [];

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
              {standingView.map((field: StandingView) => (
                <th key={field} className="border px-4 py-2 text-left capitalize">
                  {field}
                </th>
              ))}
              <th className="border px-4 py-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={idx}>
                {standingView.map((field: StandingView) => (
                  <td key={field} className="border px-4 py-2">
                    {(() => {
                      if (field === "username") return user.username ?? "-";
                      if (field === "name") return user.name ?? "-";
                      if (field === "cfHandle") return user.cfHandle ?? "-";
                      if (field === "vjudge") return user.vjudge ?? "-";
                      if (field === "gmail") return user.gmail ?? "-";
                      if (field === "level") return user.level ?? "-";
                      if (field === "university") return user.university ?? "-";
                      if (field === "faculty") return user.faculty ?? "-";
                      return "-";
                    })()}
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

