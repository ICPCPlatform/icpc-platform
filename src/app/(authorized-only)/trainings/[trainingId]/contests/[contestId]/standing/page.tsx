import { cookies } from "next/headers";
import { decryptSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getTrainingFullData } from "@/actions/getTrainingFullData";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ trainingId: string, contestId: string }> }) {
    const contestId = decodeURIComponent((await params).contestId);
    const trainingId = Number(decodeURIComponent((await params).trainingId));
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const validated = await decryptSession(sessionCookie ?? "");
    if (validated == null) {
        return notFound()
    }

    const { userId } = validated;
    const permissions = await getUserTrainingPermissions(userId, Number(trainingId));

    if (permissions.length === 0 || !(permissions.includes("View:standing"))) {
        return notFound()
    }

    // Fetch all training data using the cached function
    const training = await getTrainingFullData(trainingId);
    if (!training) {
        return notFound();
    }

    // Get contest details
    const contest = training.contests[contestId];
    if (!contest) {
        return notFound();
    }

    // Get standing data for this contest
    const standingData = training.standing[contestId];
    if (!standingData) {
        return notFound();
    }

    const standing = standingData.standing;

    // Map standings to include trainee details
    const standingWithDetails = standing.map((s) => {
        const user = training.trainees[s.userId];
        if (user) {
            return {
                ...s,
                ...user,
                userId: undefined,
            };
        }
        return undefined;
    });

    // Create navigation links for all contests in this training
    const contestLinks = Object.entries(training.contests).map(([id, contestInfo]) => (
        <Link 
            key={id}
            href={`/trainings/${trainingId}/contests/${id}/standing`}
            className={`px-4 py-2 mx-2 ${id === contestId ? 'font-bold' : ''}`}
        >
            {contestInfo.title}
        </Link>
    ));
    console.log(training);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{contest.title}</h1>
            
            {/* Contest Navigation */}
            <div className="mb-8 flex flex-wrap gap-2">
                <div className="w-full font-semibold mb-2">Navigate Contests:</div>
                {contestLinks}
            </div>

            {/* Standing Data */}
            <div className="bg-gray-100 p-4 rounded">
                <pre>{JSON.stringify(standingWithDetails, null, 4)}</pre>
            </div>
        </div>
    );
}