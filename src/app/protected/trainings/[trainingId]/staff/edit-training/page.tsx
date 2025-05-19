import TrainingForm from "@/app/protected/trainings/[trainingId]/staff/edit-training/_trainingForm";
import {
    getTraining,
    getUserEditTrainingPermissions
} from "@/app/protected/trainings/[trainingId]/staff/edit-training/actions/_editTraining";
import "@/styles/components/block.css"

/**
 * Page component for editing a training.
 * @param params - The parameters containing the training ID.
 */
export default async function EditTrainingPage({params}: { params: Promise<{ trainingId: string }> }) {
    // Parse training data from params
    const {trainingId: trainingIdStr} = await params;

    // Validate numeric parameters
    const trainingId = Number(trainingIdStr);

    // Check if the parameter is a valid number
    if (isNaN(trainingId)) throw new Error("Invalid training ID");

    // Fetch the training data
    const training = await getTraining(trainingId);

    // Check if the training data is null
    if (training === null) {
        console.error("Training not found or user doesn't have permission");
        return null;
    }

    // check if the user has permission to edit the training
    const hasEditPermission = await getUserEditTrainingPermissions(trainingId);
    if (!hasEditPermission) {
        console.error("User does not have permission to edit training");
        return null;
    }

    return (
        <div className="update-block-page">
            <TrainingForm
                initialData={training}
                isEdit={hasEditPermission}
            />
        </div>
    );
}