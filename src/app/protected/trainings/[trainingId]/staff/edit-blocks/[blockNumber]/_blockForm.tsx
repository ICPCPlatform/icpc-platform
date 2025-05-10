"use client"
import {useRouter} from "next/navigation";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {BlockFormData, blockValidations} from "@/lib/validation/training/blockValidations";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import {updateBlock} from "@/app/protected/trainings/[trainingId]/staff/edit-blocks/actions/_editBlock";


//
type staffViewBlock = {
    blockNumber: number; trainingId: number; title: string; description: string; hidden: boolean; date: Date;

};

type BlockFormProps = {
    initialData: staffViewBlock | null; isEdit?: boolean;
}


/**
 * BlockForm component for creating or editing a block.
 * @param initialData - The initial data for the block, used when editing.
 * @param isEdit - Flag to indicate if the form is for editing an existing block or creating a new one.
 * @constructor
 */
export default function BlockForm({initialData, isEdit = true}: Readonly<BlockFormProps>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if initialData is null
    const form = useForm<BlockFormData>({
        resolver: zodResolver(blockValidations), defaultValues: {
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            date: initialData?.date ? new Date(initialData.date) : undefined,
            hidden: initialData?.hidden || false,
        },
    });

    // Handle form submission
    const onSubmit: SubmitHandler<BlockFormData> = async (data) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Validate the block number and training ID
            if (isEdit && (!initialData?.blockNumber || !initialData?.trainingId)) {
                Error("Missing required block identification data");
            }
            // Update the block in the database
            await updateBlock({
                blockNumber: initialData!.blockNumber, // Non-null assertion after validation
                trainingId: initialData!.trainingId,   // Non-null assertion after validation
                ...data
            });
            // Redirect to the blocks page
            router.push(`/protected/trainings/${initialData?.trainingId}/staff/edit-blocks`);

        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save block. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (<FormProvider {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form-layout"
            noValidate
        >
            <div className="space-y-6">
                <h1 className="block-title">
                    {isEdit ? "Edit Block" : "Create New Block"}
                </h1>

                {error && (<div className="error-message text-red-600 mb-4">
                    {error}
                </div>)}

                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (<FormItem>
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
                        <FormMessage/>
                    </FormItem>)}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (<FormItem>
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
                        <FormMessage/>
                    </FormItem>)}
                />


                <FormField
                    control={form.control}
                    name="hidden"
                    render={({field}) => (<FormItem className="toggle-field">
                        <FormLabel className="toggle-label">Visibility</FormLabel>
                        <FormControl>
                            <label className="toggle-container">
                                <input
                                    type="checkbox"
                                    className="toggle-input"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    disabled={isSubmitting}
                                />
                                <span className="toggle-slider"></span>
                                <span className="ml-3 text-sm text-muted-foreground">
            {field.value ? "Hidden" : "Visible"}
          </span>
                            </label>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({field}) => (<FormItem>
                        <FormLabel className="form-label">Schedule Date</FormLabel>
                        <FormControl>
                            <input
                                type="date"
                                placeholder="Select a date"
                                className="form-input"
                                {...field}
                                // Convert Date to string for input value
                                value={field.value ? field.value.toISOString().split('T')[0] : ""}
                                // Convert string back to Date on change
                                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                disabled={isSubmitting}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)}
                />


            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="submit"
                    className="add-block-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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
    </FormProvider>);
}