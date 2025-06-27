import BlockForm from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/[blockNumber]/_blockForm";
import "@/styles/components/block.css"
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { eq , and} from "drizzle-orm";
import { db } from "@/lib/db";


/**
 * Page component for editing a block.
 * @param params - The parameters containing the block number and training ID.
 */
export default async function page({params}: { params: Promise<{ blockNumber: string, trainingId: string }> }) {

    // Parse block data from params
    const {blockNumber: blockNumberStr, trainingId: trainingIdStr} = await params;

    // Validate numeric parameters first
    const blockNumber = Number(blockNumberStr);
    const trainingId = Number(trainingIdStr);

    // Check if the parameters are valid numbers
    if (isNaN(blockNumber)) throw new Error("Invalid block number");
    if (isNaN(trainingId)) throw new Error("Invalid training ID");

    // Fetch the block data
    const block = await db.select(
        {
                trainingId:Trainings.trainingId,
                title: Blocks.title,
                description: Trainings.description,
                hidden: Blocks.hidden,
                date: Blocks.date, 
                blockNumber: Blocks.blockNumber
            
        })
        .from(Trainings)
        .where(and(eq(Trainings.trainingId, trainingId),eq(Blocks.blockNumber, blockNumber)))
        .innerJoin(Blocks, eq(Blocks.trainingId, Trainings.trainingId))
        .execute()

    // Check if the block data is null
    if (block.length === 0) {
        console.error("Block not found");
        return null;
    }

    return (
        <div className="update-block-page">
            <BlockForm
                initialData={block[0]}
                // if the user is not allowed to edit the block, redirect to the blocks page
                isEdit={true}
            />
        </div>
    );

}