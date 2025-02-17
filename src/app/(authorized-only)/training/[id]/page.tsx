import { notFound } from 'next/navigation';
import TrainingView from './_TrainingView';
import { mockTraining } from '@/lib/mock/training-data';

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TrainingPage({
    params,
}: Props) {
    const id = (await params).id;
    // For now, we only support the 'test' ID
    if (id !== 'test') {
        notFound();
    }

    return <TrainingView training={mockTraining} />;
} 