
import Link from "next/link";
import {getBlocks} from "@/app/protected/trainings/[trainingId]/blocks/actions";
export const revalidate = 60;
export default async function BlocksDetailsPage(params: { trainingId: string }) {
    try {
        const trainingIdNumber = Number(params.trainingId);

        // Add proper error handling for invalid IDs
        if (isNaN(trainingIdNumber)) {
           console.error("Invalid trainingId:", params.trainingId);
        }

        const blocks = await getBlocks(trainingIdNumber);

        return (
            <ul>
                {blocks.map((block) => (
                    <li key={block.blockNumber} className="mb-4">
                        <Link
                            href={{
                                pathname: `/protected/trainings/${params.trainingId}/blocks/${block.blockNumber}`,
                                query: { title: block.title , description: block.description},
                            }}
                            prefetch={false}
                            className="block p-4 hover:bg-gray-100"
                        >
                            <h2 className="text-lg font-semibold">{block.title}</h2>
                            <p className="text-gray-600">{block.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        );
    } catch (error) {
            console.error("Database error:", error);
    }
}