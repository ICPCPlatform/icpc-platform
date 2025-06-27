'use client';

import React, { useState } from 'react';
import { addStaffAction } from '@/app/protected/trainings/[trainingId]/staff/staff-management/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AddStaffForm({ trainingId }: { trainingId: number }) {
    const [username, setUsername] = useState('');
    const [roles, setRoles] = useState({
        instructor: false,
        problem_setter: false,
        mentor: false
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const result = await addStaffAction({
                trainingId,
                username,
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
            if (error instanceof Error) {
                setMessage('Error occurred: ' + error.message);
            } else {
                setMessage('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }

    function handleRoleChangeByName(role: keyof typeof roles, checked: boolean) {
        setRoles(prev => ({ ...prev, [role]: checked }));
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Add Staff to Training</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        placeholder="Enter username"
                    />
                </div>
                    <div className="space-y-2">
                        <Label>Roles</Label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2">
                                <Checkbox
                                name="instructor"
                                checked={roles.instructor}
                                    onCheckedChange={checked => handleRoleChangeByName('instructor', Boolean(checked))}
                            />
                            <span className="text-sm">Instructor</span>
                        </label>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                name="problem_setter"
                                checked={roles.problem_setter}
                                    onCheckedChange={checked => handleRoleChangeByName('problem_setter', Boolean(checked))}
                            />
                            <span className="text-sm">Problem Setter</span>
                        </label>
                            <label className="flex items-center gap-2">
                                <Checkbox
                                name="mentor"
                                checked={roles.mentor}
                                    onCheckedChange={checked => handleRoleChangeByName('mentor', Boolean(checked))}
                            />
                            <span className="text-sm">Mentor</span>
                        </label>
                    </div>
                </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Staff'}
                    </Button>
            </form>
            {message && (
                    <div
                        className={`mt-4 p-3 rounded-md text-sm ${
                    message.includes('successfully')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                        style={{
                            backgroundColor: message.includes('successfully') ? 'var(--green-100)' : 'var(--red-100)',
                            color: message.includes('successfully') ? 'var(--green-700)' : 'var(--red-700)'
                        }}
                    >
                    {message}
                </div>
            )}
            </CardContent>
        </Card>
    );
}
