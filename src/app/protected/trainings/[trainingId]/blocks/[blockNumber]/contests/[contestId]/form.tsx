'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contest } from '@/lib/types/contest';
import { updateContest } from '../../../(no-layout)/[blockId]/contests/[contestId]';
import { contestSchema } from './validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';


export function EditContestForm({ contest }: Contest) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<Contest>({
        resolver: zodResolver(contestSchema),
        defaultValues: {
            title: contest.title,
            // implement
        },
    });

    async function onSubmit(data: Contest) {
        setIsSubmitting(true);
        try {
            await updateContest({
                ...data,
            });

            toast({
                title: 'Success',
                description: 'Contest updated successfully',
            });
            router.push(`/protected/trainings/${trainingId}`);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update contest',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contest Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter contest name" {...field} />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the contest..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This will be visible to participants.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rules"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rules</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="List the contest rules..."
                                    className="min-h-[200px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Add additional contest fields as needed */}

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => router.push(`/protected/trainings/${trainingId}`)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}