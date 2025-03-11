import { cookies } from "next/headers";
import { decryptSession } from "@/lib/session";
import {notFound, redirect} from "next/navigation";
import { db } from "@/lib/db";
import { Contests } from "@/lib/db/schema/training/Contests";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { Users } from "@/lib/db/schema/user/Users";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions" ;
import {and, eq} from "drizzle-orm";
import {inArray} from "drizzle-orm/sql/expressions/conditions";
import {Institutes} from "@/lib/db/schema/user/Institutes";
import {Faculties} from "@/lib/db/schema/user/Faculties";


 const ___ = {
    userId: Users.userId,
     name: UsersFullData.firstNameEn,
    cfHandle: Users.cfHandle,
    vjudge: Users.vjHandle,
    gmail: Users.gmail,
    level: UsersFullData.academicYear,
    university: Institutes.name,
    faculty: Faculties.name
}
// Define types
type Contest = {
    title: string;
    description: string;
    type: string;
    trainingId: number;
}

type Training = {
    standing: StandingData;
    standingView: string[]; // Dynamic configuration

}

type StandingData =Record< number, {
        standing: StandingEntry[];
        problems: string[];
    }
>

type StandingEntry = {
    userId: string;
    penalty: number;
    solved: string[];
    attempted: string[];
}

type Trainee = {
    userId?: string ,
    name?: string | null,
    cfHandle?: string ,
    vjudge?: string | null,
    gmail?: string,
    level?: number,
    university?: string,
    faculty?: string
}
const selectKeysFromObjects = (data : typeof ___, keys: string[]) => {
       return  keys.reduce((acc, key) => {
            if (key in data) {
                // @ts-expect-error - This is a hack to get around the type system
                acc[key] = data[key];
            }
            return acc;
        }, {});
};

export default async function Page({ params }: { params: Promise<{ trainingId : string ,contestId: string }> }) {
    const contestId = decodeURIComponent((await params).contestId);
    const trainingId = Number(decodeURIComponent((await params).trainingId));
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const validated = await decryptSession(sessionCookie ?? "");
    if(validated == null){
        return notFound()
    }

    // Fetch contest details
    const contestResult = await db.select({
        title: Contests.title,
        description: Contests.description,
        type: Contests.type,
        trainingId: Contests.trainingId
    }).from(Contests).where(and(eq(Contests.contestId,contestId),eq(Contests.trainingId,Number(trainingId)))).execute();

    if (contestResult.length === 0) {
        return notFound()
    }

    const contest: Contest = contestResult[0];

    const { userId } = validated;
    const permissions = await getUserTrainingPermissions(userId, Number(trainingId));

    if (permissions.length === 0 || !( permissions.includes("View:standing"))) {
        return notFound()
    }

    // Fetch training details
    const trainingResult = await db.select({
        standing: Trainings.standing,
        standingView: Trainings.standingView
    }).from(Trainings).where(eq(Trainings.trainingId,trainingId)).execute();

    if (trainingResult.length === 0) {
        redirect("/404");
    }

    const training: Training = trainingResult[0] as Training;

    // Find the standing for the current contest
    const standingData = training.standing[Number(contestId)]; // Direct lookup using contestId
   // const standingData = training.standing.find((s: StandingData) => s.contestId === contestId);
    const standing: StandingEntry[] = standingData?.standing || [];
    // const problems: string[] = standingData?.problems || [];
    if (!training.standingView) {
        redirect("/404");
    }

    // Fetch trainee details for each trainee in the standing
    const { standingView} = training
    standingView.push('userId');
    const traineeIds = standing.map((s: StandingEntry) => s.userId);
    const trainees: Trainee [] = await db.select(
        selectKeysFromObjects(___, standingView)
    ).from(Users)
        .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
        .leftJoin(Institutes,eq(Institutes.id,UsersFullData.instituteId))
        .leftJoin(Faculties,eq(Faculties.id,UsersFullData.facultyId))
        .where(inArray(Users.userId,traineeIds))

        .execute() as  Trainee [];
    console.log(standing)
    // Map standings to include trainee details
    const standingWithDetails: (Trainee | undefined)[] = standing.map((s: StandingEntry) => {
        const user = trainees.find((usr) => usr.userId === s.userId);
        if (user) {
            const obj: Trainee = {
                ...s,
                ...user, // Assuming penalty is used as points
                userId: undefined,
            };
            return obj
        }
        return undefined;
    });
    console.log(standingWithDetails);


    // Get the fields to display based on standingView configuration

    return (
        <>
            <h1>{contest.title}</h1>
            <div>
                <pre>{JSON.stringify(standingWithDetails,null,4)}</pre>

            </div>
        </>
    );
}