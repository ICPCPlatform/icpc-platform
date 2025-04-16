import { Material } from "@/lib/types/Training";
import {timestamp} from "drizzle-orm/pg-core";

export type Block = {
    trainingId: number;
    blockId: number;
    title: string;
    description: string;
    hidden: boolean;
    date: typeof timestamp;
    material: Material;
    deleted?: typeof timestamp;
}