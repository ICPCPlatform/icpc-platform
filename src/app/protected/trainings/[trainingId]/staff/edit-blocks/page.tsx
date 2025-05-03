import Link from "next/link";
import {
    deleteBlock,
    getAllBlocks,
    getUserEditBlockPermissions
} from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/actions/_editBlock";
import { PencilIcon, TrophyIcon, DocumentTextIcon, PlusIcon } from "@heroicons/react/24/outline";
import { staffViewBlock } from "@/lib/types/staff/StaffTrainingTypes";

export const revalidate = 60;

export default async function BlocksPage({ params }: { params: { trainingId: string } }) {
    try {
        const trainingIdNumber = Number(params.trainingId);
        if (isNaN(trainingIdNumber)) {
            console.error("Invalid trainingId:", params.trainingId);
            return null;
        }

        const blocks: staffViewBlock[] | null = await getAllBlocks(trainingIdNumber);
        const userEditBlockPermissions = await getUserEditBlockPermissions(trainingIdNumber);

        return (
            <div className="blocks-wrapper animate-fadeIn">
                <div className="blocks-content">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Training Blocks
                        </h1>
                        {userEditBlockPermissions && (
                            <Link
                                href={`/protected/trainings/${params.trainingId}/staff/edit-blocks/_createBlock`}
                                className="add-block-button"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Create Block
                            </Link>
                        )}
                    </div>

                    <div className="blocks-list">
                        {blocks?.length ? (
                            blocks.map((block) => (
                                <div
                                    key={block.blockNumber}
                                    className="block-card"
                                >
                                    <div className="block-header">
                                        <div>
                                            <h3 className="block-title">{block.title}</h3>
                                            <p className="block-description">{block.description}</p>
                                        </div>
                                    </div>

                                    <div className="actions-section">
                                        <button
                                          onClick={() => {
                                                // Handle edit action here
                                                window.location.href = `/protected/trainings/${params.trainingId}/staff/edit-blocks/${block.blockNumber}`;
                                                // Example: editBlock(block.blockNumber);
                                          }}
                                            className="action-button edit-button"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                            Edit Block
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Handle delete action here
                                                deleteBlock({
                                                    trainingId: block.trainingId,
                                                    blockNumber: block.blockNumber
                                                });
                                                // Example: deleteBlock(block.blockNumber);
                                            }}
                                            className="action-button delete-button"
                                        >
                                            <span className="w-5 h-5">🗑️</span>
                                            Delete Block
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            userEditBlockPermissions ? (
                                <div className="empty-state">
                                    <DocumentTextIcon className="empty-icon" />
                                    <h3 className="empty-text">No blocks created yet</h3>
                                    <p className="text-muted-foreground">
                                        Start by creating your first training block
                                    </p>
                                    <Link
                                        href={`/protected/trainings/${encodeURIComponent(params.trainingId)}/blocks/create`}
                                        className="add-block-button"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        Create Block
                                    </Link>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <TrophyIcon className="empty-icon" />
                                    <h3 className="empty-text">No blocks available</h3>
                                    <p className="text-muted-foreground">
                                        You don't have permission to create blocks
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Database error:", error);
        return (
            <div className="popup-container show">
                <div className="popup-content">
                    <div className="popup-icon">⚠️</div>
                    <h2 className="popup-message">Error loading blocks</h2>
                    <p className="text-muted-foreground">Please try again later</p>
                    <button className="popup-close-btn" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }
}