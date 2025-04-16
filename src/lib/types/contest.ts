import {Judge} from "@/lib/db/schema/training/Contests";

export type Contest =
{
    id: string;
    trainingId: string;
    blockId: string;
    groupId: string;
    title: string;
    description: string;
    judge: Judge;
    type: string;
    pointSpp : number;
    firstPoints : number;
    calcSystem: string;
}
