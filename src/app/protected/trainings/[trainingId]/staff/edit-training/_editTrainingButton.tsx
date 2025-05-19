"use client"
import {Button} from "@/components/ui/button";
import "@/styles/components/block.css";
import {PencilIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

/**
 * EditTrainingButton component for navigating to the edit training page.
 * @param params - The parameters containing the training ID.
 * @constructor
 */
export default function EditTrainingButton(params: Readonly<{
    trainingId: number;
}>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditTraining = () => {
        setIsSubmitting(true);
        // Navigate to the edit training page
        router.push(`/protected/trainings/${params.trainingId}/staff/edit-training/${params.trainingId}`);
    };

    return (
        <Button
            className="edit-button"
            onClick={handleEditTraining}
            disabled={isSubmitting}
        >
            <PencilIcon className="h-4 w-4 mr-2"/>
            Edit Training
        </Button>
    );
}