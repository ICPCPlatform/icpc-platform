import BlockForm from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/[blockNumber]/_blockForm";
import {getBlockByNumber} from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/actions/_editBlock";
import {staffViewBlock} from "@/lib/types/staff/StaffTrainingTypes";
import  "@/styles/components/block.css"


export default async function page({params}: { params: Promise<{ blockNumber: string, trainingId: string }> }) {
    console.log('===============================================================')
    // Parse block data from params

    const { blockNumber: blockNumberStr,trainingId: trainingIdStr } = await params;

    // Validate numeric parameters first
    const blockNumber = Number(blockNumberStr);
    const trainingId = Number(trainingIdStr);
    if (isNaN(blockNumber)) throw new Error("Invalid block number");
    if (isNaN(trainingId)) throw new Error("Invalid training ID");
    const block  = await getBlockByNumber(trainingId, blockNumber);
    if (block === null) {
        console.error("Block not found");
        return null;
    }
    const resultBlock : staffViewBlock = block[0];

    return (
        <div className="update-block-page">
            <BlockForm
                initialData={resultBlock}
                isEdit={true}
            />
        </div>
    );

}