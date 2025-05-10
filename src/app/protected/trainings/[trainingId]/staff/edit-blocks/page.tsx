import {
    getAllBlocks,
    getUserEditBlockPermissions
} from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/actions/_editBlock";
import {DocumentTextIcon, EyeIcon} from "@heroicons/react/24/outline";
import "@/styles/components/block.css";
import EditBlockButton from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/_editBlockButton";

export const revalidate = 60;


/**
 * Page component for displaying and editing training blocks.
 * @param params - The parameters containing the training ID.
 */
export default async function BlocksPage({params}: Readonly<{ params: Promise<{ trainingId: string }> }>) {
    try {
        // Parse trainingId from params
        const {trainingId} = await params;
        // Validate numeric parameters first
        const trainingIdNumber = Number(trainingId);
        // Check if the parameters are valid numbers
        if (isNaN(trainingIdNumber)) {
            console.error("Invalid trainingId:", trainingId);
            return null;
        }

        // Fetch blocks and user permissions
        const blocks = await getAllBlocks(trainingIdNumber);
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
                                            <h3 className="block-title">
                                                {block.title}

                                            </h3>
                                            <div
                                                className={`visibility-badge ${block.hidden ? 'hidden' : 'visible'}`}>
                                                <EyeIcon className="w-4 h-4"/>
                                                <span>{block.hidden ? 'Hidden' : 'Visible'}</span>
                                            </div>
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
                                <DocumentTextIcon className="empty-icon"/>
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