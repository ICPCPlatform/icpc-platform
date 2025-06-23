'use client';

import React, { useState } from 'react';
import {searchByUsername} from "@/app/protected/trainings/[trainingId]/staff/edit-training/add-staff/actions";
import type { Staff } from "@/lib/db/schema/training/Staff";

export default function SearchUser() {
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState<Staff[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSearch(e) {
        e.preventDefault();
        setError('');
        setSearchResults([]);
        setIsLoading(true);

        try {
            const res = await searchByUsername(username);

            setSearchResults(res);
        } catch (err) {
            setError('Error occurred: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Search User</h2>

            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        placeholder="Enter username"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {searchResults && (
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
                    {searchResults.length === 0 ? (
                        <p>No users found</p>
                    ) : (
                        <div className="space-y-2">
                            {searchResults.map((result, index) => (
                                <div key={index} className="bg-white p-3 rounded border">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><strong>User ID:</strong> {result.Users?.userId}</div>
                                        <div><strong>Username:</strong> {result.Users?.username}</div>
                                        <div><strong>Email:</strong> {result.Users?.email}</div>
                                        <div><strong>Role:</strong> {result.Users?.role}</div>
                                    </div>
                                    {result.Staff && (
                                        <div className="mt-2 pt-2 border-t">
                                            <strong>Staff Roles:</strong>
                                            <div className="flex gap-4 text-sm">
                                                {result.Staff.instructor && <span className="text-green-600">Instructor</span>}
                                                {result.Staff.problemSetter && <span className="text-blue-600">Problem Setter</span>}
                                                {result.Staff.mentor && <span className="text-purple-600">Mentor</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
