import Link from "next/link";
import {
    deleteBlock,
    getAllBlocks,
    getUserEditBlockPermissions
} from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/actions/_editBlock";
import { PencilIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { staffViewBlock } from "@/lib/types/staff/StaffTrainingTypes";
import {Button}  from "@/components/ui/button";
import "@/styles/components/block.css";
import EditBlockButton from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/_editBlockButton";
export const revalidate = 60;

export default async function BlocksPage({ params }: Readonly<{ params: Promise<{ trainingId: string }> }>) {
    try {
        const { trainingId } = await params;
        const trainingIdNumber = Number(trainingId);
        if (isNaN(trainingIdNumber)) {
            console.error("Invalid trainingId:", trainingId);
            return null;
        }

        // const blocks = async (trainingId: number) => {
        //     const res = await fetch(`/api/trainings/${trainingId}/blocks`);
        //     if (!res.ok) throw new Error('Failed to fetch blocks');
        //     return res.json();
        // };
        // Validate numeric parameters first
        const blocks: staffViewBlock[] | null = await getAllBlocks(trainingIdNumber);
        const userEditBlockPermissions = await getUserEditBlockPermissions(trainingIdNumber);
        return (
            <div className="blocks-wrapper animate-fadeIn">
                <div className="blocks-content">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Training Blocks
                        </h1>
                    </div>

                    <div className="blocks-list">
                        {blocks?.length ? (
                            blocks.map((block) => (
                                <div key={block.blockNumber} className="block-card">
                                    <div className="block-header">
                                        <div>
                                            <h3 className="block-title">{block.title}</h3>
                                            <p className="block-description">{block.description}</p>
                                        </div>
                                    </div>

                                    {userEditBlockPermissions && (
                                        <div className="actions-section">
                                            <EditBlockButton
                                                trainingId={block.trainingId}
                                                blockNumber={block.blockNumber}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <DocumentTextIcon className="empty-icon" />
                                <h3 className="empty-text">No blocks created yet</h3>
                            </div>
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