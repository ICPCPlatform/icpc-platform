import { Material } from "@/lib/types/Training";

export type Block = {
    trainingId: number;
    blockNumber: number;
    title: string;
    description: string;
    material: Material;
}[];