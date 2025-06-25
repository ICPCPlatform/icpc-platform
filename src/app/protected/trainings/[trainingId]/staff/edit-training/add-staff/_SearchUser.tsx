'use client';

import React, { useState, useTransition } from 'react';
import { searchByUsername } from "@/app/protected/trainings/[trainingId]/staff/edit-training/add-staff/actions";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import { Staff } from "@/lib/db/schema/training/Staff"; // Unused, remove

export default function SearchUser({ trainingId }: { trainingId: number }) {
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof searchByUsername>>>([]);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();


    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSearchResults([]);
        startTransition(async () => {
            try {
                const res = await searchByUsername(username, trainingId);
                setSearchResults(res);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError('Error occurred: ' + err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            }
        });
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Search User</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="mb-4 space-y-2">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label htmlFor="search-username">Username</Label>
                            <Input
                                id="search-username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                placeholder="Enter username"
                            />
                        </div>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                </form>
                {error && (
                    <div className="mb-4 p-3 rounded-md text-sm" style={{ backgroundColor: 'var(--red-100)', color: 'var(--red-700)' }}>
                        {error}
                    </div>
                )}
                {searchResults && (
                    <div className="bg-muted p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
                        {searchResults.length === 0 ? (
                            <p>No users found</p>
                        ) : (
                            <div className="space-y-2">
                                {searchResults.map((result, index) => (
                                    <div key={index} className="bg-background p-3 rounded border">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><strong>Username:</strong> {result.username}</div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t">
                                            <strong>Staff Roles:</strong>
                                            <div className="flex gap-4 text-sm">
                                                {(result.instructor || result.problemSetter || result.mentor) ? (
                                                    <>
                                                        {result.instructor && <span style={{ color: 'var(--green-700)' }}>Instructor</span>}
                                                        {result.problemSetter && <span style={{ color: 'var(--blue-700)' }}>Problem Setter</span>}
                                                        {result.mentor && <span style={{ color: 'var(--purple-700)' }}>Mentor</span>}
                                                    </>
                                                ) : (
                                                    <span style={{ color: 'var(--red-700)' }}>Not a staff member for this training</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
