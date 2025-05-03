"use client"

import { staffViewBlock } from "@/lib/types/staff/StaffTrainingTypes";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { BlockFormData, blockValidations } from "@/lib/validation/training/blockValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import {updateBlock} from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/actions/_editBlock";

type BlockFormProps = {
    initialData: staffViewBlock | null;
    isEdit?: boolean;
}

export default function BlockForm({ initialData, isEdit = true}: BlockFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<BlockFormData>({
        resolver: zodResolver(blockValidations),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
        },
    });

    const onSubmit: SubmitHandler<BlockFormData> = async (data) => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (isEdit && (!initialData?.blockNumber || !initialData?.trainingId)) {
                 Error("Missing required block identification data");
            }

            await updateBlock({
                blockNumber: initialData!.blockNumber, // Non-null assertion after validation
                trainingId: initialData!.trainingId,   // Non-null assertion after validation
                ...data
            });
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save block. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="form-layout"
                noValidate
            >
                <div className="space-y-6">
                    <h1 className="block-title">
                        {isEdit ? "Edit Block" : "Create New Block"}
                    </h1>

                    {error && (
                        <div className="error-message text-red-600 mb-4">
                            {error}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Title</FormLabel>
                                <FormControl>
                                    <input
                                        type="text"
                                        placeholder="Enter block title..."
                                        className="form-input"
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Description</FormLabel>
                                <FormControl>
                  <textarea
                      placeholder="Describe the content of the block..."
                      maxLength={512}
                      rows={5}
                      className="form-input resize-none"
                      {...field}
                      disabled={isSubmitting}
                  />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="submit"
                        className="add-block-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Block')}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="delete-button"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}