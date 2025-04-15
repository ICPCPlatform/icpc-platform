import { Suspense } from 'react';
import TrainingBlocksLoading from "@/app/protected/trainings/[trainingId]/blocks/BlocksLoading";
import BlocksDetailsPage from "@/app/protected/trainings/[trainingId]/blocks/blocksDetails";

interface PageProps {
    params: {
        trainingId: string;
    };
}
export const revalidate = 60;
export default async function Page({ params }: PageProps) {

    console.log("Training ID:=========================", params.trainingId);

    return (
        <div className="container mx-auto p-4 md:py-6">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                <div className="w-full lg:flex-[3]">
                    <h1 className="text-2xl font-semibold mb-4">Training Blocks</h1>
                    <Suspense fallback={TrainingBlocksLoading}>
                        <BlocksDetailsPage trainingId={params.trainingId} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
