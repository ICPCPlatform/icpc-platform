"use client"

import { useRouter } from "next/navigation"
import {FormProvider, useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTrainingContext } from "@/providers/training"
import { blockValidations, type BlockFormData } from "@/lib/validation/blockValidations"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import "@/styles/components/trainings/blocks/blocks.css"
import updateBlock from "@/app/protected/trainings/[trainingId]/blocks/actions";
type TrainingBlockFormProps = {
    params: { trainingId: string; blockNumber: string }
}

export default function TrainingBlockForm({ params }: TrainingBlockFormProps) {
    const router = useRouter()
    const blockNumber = Number(params.blockNumber)
    const trainingId = Number (params.trainingId)
    const trainingData = useTrainingContext()

    const block = trainingData?.blocks.find((b) => b.blockNumber === blockNumber)

    const form = useForm<BlockFormData>({
        resolver: zodResolver(blockValidations),
        defaultValues: {
            title: block?.title || "",
            description: block?.description || "",
        },
    })

    const { handleSubmit } = form

    const onSubmit = async (data: BlockFormData) => {
        try {
            console.log("Form data:", data)
            await updateBlock({ trainingId: trainingId, blockNumber: blockNumber, ...data })
            console.log("Update successful")
        } catch (err) {
            console.log("Update failed:", err)
        }
    }

    if (!block) return <p className="empty-text">Block not found</p>

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="form-layout"
            >
                <div className="space-y-6">
                    <h1 className="block-title">Edit Block</h1>

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
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="delete-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </FormProvider>
    )
}