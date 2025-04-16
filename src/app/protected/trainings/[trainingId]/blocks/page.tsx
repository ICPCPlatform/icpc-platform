import { Suspense } from 'react';
import TrainingBlocksLoading from "@/app/protected/trainings/[trainingId]/blocks/BlocksLoading";
import BlocksDetailsPage from "@/app/protected/trainings/[trainingId]/blocks/blocksDetails";
import { Params } from 'next/dist/server/request/params';


export const revalidate = 60;
export default function Page({ params }:  { params: { trainingId: string } }) {
    
    console.log("Training ID:=========================", params.trainingId);

    return (
        <div className="container mx-auto p-4 md:py-6">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                <div className="w-full lg:flex-[3]">
                    <Suspense fallback={TrainingBlocksLoading}>
                        <BlocksDetailsPage params={{ trainingId: params.trainingId }} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
