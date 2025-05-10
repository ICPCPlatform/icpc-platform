"use client"
import {Button} from "@/components/ui/button";
import "@/styles/components/block.css";
import {PencilIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

/**
 * EditBlockButton component for navigating to the edit block page.
 * @param params - The parameters containing the training ID and block number.
 * @constructor
 */
export default function EditBlockButton(params: Readonly<{
    trainingId: number;
    blockNumber: number;
}>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditBlock = () => {
        setIsSubmitting(true);
        // return to the update block page
        router.push(`/protected/trainings/${params.trainingId}/staff/edit-blocks/${params.blockNumber}`);

    };

    return (
        <Button
            className="edit-button"
            onClick={handleEditBlock}
            disabled={isSubmitting}
        >
            <PencilIcon className="h-4 w-4 mr-2"/>
            Edit Block
        </Button>
    );
}