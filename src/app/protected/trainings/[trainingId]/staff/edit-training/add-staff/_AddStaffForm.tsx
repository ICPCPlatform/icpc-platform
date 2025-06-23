'use client';

import React, { useState } from 'react';
import { addStaffAction } from '@/app/protected/trainings/[trainingId]/staff/edit-training/add-staff/actions';

export default function AddStaffForm(trainingId : string) {
    const [username, setUsername] = useState('');
    const [roles, setRoles] = useState({
        instructor: false,
        problem_setter: false,
        mentor: false
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // First search for user by username
            const searchRes = await fetch(`/api/users/search?username=${username}`);
            if (!searchRes.ok) {
                const errorData = await searchRes.json();
                setMessage(errorData.error || 'User not found or unauthorized');
                return;
            }

            const userData = await searchRes.json();
            const userId = userData[0]?.Users?.userId;

            if (!userId) {
                setMessage('User not found');
                return;
            }

            // Add staff using server action
            const result = await addStaffAction({
                trainingId,
                userId,
                roles
            });

            if (result.success) {
                setMessage('Staff added successfully');
                setUsername('');
                setRoles({ instructor: false, problem_setter: false, mentor: false });
            } else {
                setMessage(result.error || 'Failed to add staff');
            }
        } catch (error) {
            setMessage('Error occurred: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleRoleChange(e) {
        const { name, checked } = e.target;
        setRoles(prev => ({ ...prev, [name]: checked }));
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Staff to Training</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username:
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter username"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Roles:</label>

                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="instructor"
                                checked={roles.instructor}
                                onChange={handleRoleChange}
                                className="mr-2"
                            />
                            <span className="text-sm">Instructor</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="problem_setter"
                                checked={roles.problem_setter}
                                onChange={handleRoleChange}
                                className="mr-2"
                            />
                            <span className="text-sm">Problem Setter</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="mentor"
                                checked={roles.mentor}
                                onChange={handleRoleChange}
                                className="mr-2"
                            />
                            <span className="text-sm">Mentor</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? 'Adding...' : 'Add Staff'}
                </button>
            </form>

            {message && (
                <div className={`mt-4 p-3 rounded-md ${
                    message.includes('successfully')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
}
