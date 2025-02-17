import { notFound } from 'next/navigation';
import TrainingView from './_TrainingView';
import { mockTraining } from '@/lib/mock/training-data';

interface TrainingPageProps {
    params: {
        id: string;
    };
}

export default function TrainingPage({ params }: TrainingPageProps) {
    // For now, we only support the 'test' ID
    if (params.id !== 'test') {
        notFound();
    }

    return <TrainingView training={mockTraining} />;
} 