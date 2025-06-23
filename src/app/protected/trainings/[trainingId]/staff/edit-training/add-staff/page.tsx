'use client';

import React, { useState } from 'react';
import AddStaffForm from '@/app/protected/trainings/[trainingId]/staff/edit-training/add-staff/_AddStaffForm';

export default function StaffManagementPage() {
    const [activeTab, setActiveTab] = useState('add');
    const [trainingId, setTrainingId] = useState('1'); // You can make this dynamic

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Staff Management</h1>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-md">
                        <button
                            onClick={() => setActiveTab('add')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                activeTab === 'add'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Add Staff
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                activeTab === 'search'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Search Users
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                activeTab === 'list'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Staff List
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === 'add' && <AddStaffForm trainingId={trainingId} />}
                    {activeTab === 'search' && <SearchUser />}
                    {activeTab === 'list' && <TrainingStaffList trainingId={trainingId} />}
                </div>
            </div>
        </div>
    );
}
