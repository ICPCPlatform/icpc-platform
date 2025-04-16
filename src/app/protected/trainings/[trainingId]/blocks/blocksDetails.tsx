import Link from "next/link";
import { getBlocks } from "@/app/protected/trainings/[trainingId]/blocks/actions";
import {
    PencilIcon,
    TrophyIcon,
    DocumentTextIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

export const revalidate = 60;

export default async function BlocksPage({ params }: { params: { trainingId: string } }) {
    try {
        const trainingIdNumber = Number(params.trainingId);
        if (isNaN(trainingIdNumber)) {
            console.error("Invalid trainingId:", params.trainingId);
            return;
        }

        const blocks = await getBlocks(trainingIdNumber);

        return (
            <div className="blocks-wrapper animate-fadeIn">
                <div className="blocks-content">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] tracking-tight">
                            Training Blocks
                        </h1>
                        <Link
                            href={`/protected/trainings/${params.trainingId}/blocks/create`}
                            className="add-block-button bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <PlusIcon className="w-5 h-5" />
                            New Block
                        </Link>
                    </div>

                    {blocks.length > 0 ? (
                        <div className="blocks-list">
                            {blocks.map((block) => (
                                <div
                                    key={block.blockNumber}
                                    className="block-card bg-[hsl(var(--background))] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 mb-6 transform hover:scale-[1.03]"
                                >
                                    <div className="block-header mb-4">
                                        <h3 className="block-title text-2xl font-semibold text-[hsl(var(--foreground))] mb-2">
                                            {block.title}
                                        </h3>
                                        <p className="block-description text-[hsl(var(--muted-foreground))]">{block.description}</p>
                                    </div>

                                    <div className="actions-section flex gap-3">
                                        <Link
                                            href={`/protected/trainings/${params.trainingId}/blocks/${block.blockNumber}/edit-block`}
                                            className="action-button edit-button bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.8)] px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                            Edit Block
                                        </Link>
                                        <Link
                                            href={`/protected/trainings/${params.trainingId}/blocks/${block.blockNumber}/contests`}
                                            className="action-button contest-button bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.9)] px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <TrophyIcon className="w-5 h-5" />
                                            View Contests
                                        </Link>
                                        <Link
                                            href={`/protected/trainings/${params.trainingId}/blocks/${block.blockNumber}/delete`}
                                            className="action-button delete-button bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <span className="w-5 h-5">🗑️</span>
                                            Delete Block
                                        </Link>
                                        <Link
                                            href={`/protected/trainings/${params.trainingId}/blocks/${block.blockNumber}/material`}
                                            className="view-material-button bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            View Material
                                        </Link>

                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state flex flex-col items-center p-8 bg-[hsl(var(--muted))] rounded-xl shadow-md border border-[hsl(var(--border))]">
                            <DocumentTextIcon className="empty-icon w-12 h-12 text-[hsl(var(--muted-foreground))]" />
                            <h3 className="empty-text text-xl font-semibold text-[hsl(var(--foreground))] mt-4">No blocks created yet</h3>
                            <p className="text-[hsl(var(--muted-foreground))] mt-2 mb-4">
                                Start by creating your first training block
                            </p>
                            <Link
                                href={`/protected/trainings/${params.trainingId}/blocks/create`}
                                className="add-block-button bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Create Block
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}
