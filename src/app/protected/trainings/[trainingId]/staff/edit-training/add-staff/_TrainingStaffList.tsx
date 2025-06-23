'use client';

import React, { useEffect, useState } from 'react';
import {getAllTrainingStaff} from "@/app/protected/trainings/[trainingId]/staff/edit-training/add-staff/actions";
import { Staff } from "@/lib/db/schema/training/Staff";

export default function TrainingStaffList( trainingId: string) {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStaff() {
            if (!trainingId) return;

            setIsLoading(true);
            try {
                const res = await getAllTrainingStaff(trainingId);

                setStaffList(res);
            } catch (err) {
                setError('Error occurred: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStaff();
    }, [trainingId]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Training Staff</h3>

            {staffList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No staff found for this training.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">User ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Instructor</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Problem Setter</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Mentor</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffList.map((staff) => (
                            <tr key={staff.userId} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{staff.userId}</td>
                                <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                        staff.instructor
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                      {staff.instructor ? 'Yes' : 'No'}
                    </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                        staff.problemSetter
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                      {staff.problemSetter ? 'Yes' : 'No'}
                    </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                        staff.mentor
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                      {staff.mentor ? 'Yes' : 'No'}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
