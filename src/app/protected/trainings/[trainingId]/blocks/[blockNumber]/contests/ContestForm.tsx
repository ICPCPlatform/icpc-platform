
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import "@/styles/components/trainings/blocks/contests/contests.css"
import { FormProvider } from "react-hook-form";

export default function ContestForm({ params }: { params: { trainingId: string; blockNumber: string; contestId: string; } }) {
    const { trainingId, blockNumber, contestId } = params;
    
    return (
        <FormProvider {...{}}>
            <FormControl>
                <FormField>
                    <FormLabel>Contest Name</FormLabel>
                    <FormItem>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </FormControl>

        </FormProvider>
    );
}