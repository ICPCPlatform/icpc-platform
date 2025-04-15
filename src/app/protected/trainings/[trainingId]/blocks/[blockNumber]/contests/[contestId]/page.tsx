
import React from 'react';
import { redirect } from 'next/navigation';
import { decryptSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

interface PageProps {
    params: {
        id: string;
        blockId: string;
    };
}
export default async function EditContestPage ( { params }: PageProps )
{
    const { blockId } = params;

    return (
        <div className="container mx-auto p-4 md:py-6">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                <div className="w-full lg:flex-[3]">
                    <h1>Edit Contest</h1>
                    {/* Add your edit contest form here */}
                </div>
                <div className="w-full lg:w-[320px] lg:self-start">
                    {/* Add your sidebar here */}
                </div>
            </div>
        </div>
    );
}