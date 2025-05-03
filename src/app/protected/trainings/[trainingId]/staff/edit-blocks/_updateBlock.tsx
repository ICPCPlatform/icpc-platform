import {staffViewBlock} from "@/lib/types/staff/StaffTrainingTypes";
import BlockForm from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/_blockForm";


export default function updateBlockPage({params} :{ params: { block: staffViewBlock } }) {
    const block = params.block;
    if (!block) {
        throw new Error("Block data is required");
    }
    // Validate numeric parameters first
    const blockNumber = Number(block.blockNumber);
    const trainingId = Number(block.trainingId);
    if (isNaN(blockNumber)) throw new Error("Invalid block number");
    if (isNaN(trainingId)) throw new Error("Invalid training ID");
    // Ensure you're importing these components

    return (
        <div className="update-block-page">
            <BlockForm
                initialData={block}
                isEdit={true}
            />
        </div>
    );

}