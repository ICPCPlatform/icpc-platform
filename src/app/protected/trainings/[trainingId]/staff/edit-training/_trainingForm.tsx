"use client"
import {useRouter} from "next/navigation";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {TrainingFormData, trainingValidations} from "@/lib/validation/training/trainingValidations";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import {updateTraining} from "@/app/protected/trainings/[trainingId]/staff/edit-training/actions/_editTraining";
import {Status} from "@/lib/db/schema/training/Trainings";


export type TrainingEdit = {
    trainingId: number;
    title: string;
    description: string;
    startDate: Date;// should not be after expiration of the date
    duration: number;// also number of blocks
    status: Status;
    headId: string;
    chiefJudge: string;
};

type TrainingFormProps = {
    initialData: TrainingEdit;
    isEdit?: boolean;
}


/**
 * TrainingForm component for creating or editing a training.
 * @param initialData - The initial data for the training, used when editing.
 * @param isEdit - Flag to indicate if the form is for editing an existing training or creating a new one.
 * @constructor
 */
export default function TrainingForm({initialData, isEdit}: Readonly<TrainingFormProps>) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if initialData is null
    const form = useForm<TrainingFormData>({
        resolver: zodResolver(trainingValidations), defaultValues: {
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
            duration: initialData?.duration ?? 1,
            status: initialData?.status || 'private',
        },
    });

    // Handle form submission
    const onSubmit: SubmitHandler<TrainingFormData> = async (data) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Validate the training ID
            if (isEdit && !initialData?.trainingId) {
                throw new Error("Missing required training identification data");
            }
            // Update the training in the database
            await updateTraining({
                trainingId: initialData!.trainingId, // Non-null assertion after validation
                ...data
            });
            // Redirect to the trainings page
            router.push(`/protected/trainings/${initialData?.trainingId}/staff`);

        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save training. Please try again.");
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
                    {isEdit ? "Edit Training" : "Create New Training"}
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
                                placeholder="Enter training title..."
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
                              placeholder="Describe the content of the training..."
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
                    name="startDate"
                    render={({field}) => (<FormItem>
                        <FormLabel className="form-label">Start Date</FormLabel>
                        <FormControl>
                            <input
                                type="date"
                                placeholder="Select a start date"
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

                <FormField
                    control={form.control}
                    name="duration"
                    render={({field}) => (<FormItem>
                        <FormLabel className="form-label">Duration (weeks)</FormLabel>
                        <FormControl>
                            <input
                                type="number"
                                placeholder="Enter duration in weeks"
                                className="form-input"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                min={1}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({field}) => (<FormItem>
                        <FormLabel className="form-label">Status</FormLabel>
                        <FormControl>
                            <select
                                className="form-input"
                                {...field}
                                value={field.value ?? ""} // converts null or undefined to ""
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>Select status</option>
                                <option value="active">Active</option>
                                <option value="roadmap">Roadmap</option>
                                <option value="private">Private</option>
                                <option value="completed">Completed</option>
                                <option value="planned">Planned</option>
                            </select>

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