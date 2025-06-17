"use client";

import { useState, useEffect } from "react";
import { addStaffAction } from "./actions";
import {searchByUsername} from "@/app/protected/trainings/[trainingId]/staff/edit-training/add-staff/actions"; // Import the add staff action

export default function AddStaffPage({ trainingId }: { trainingId: string }) {
    const [staffList, setStaffList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({
        instructor: false,
        problem_setter: false,
        mentor: false,
        chief_judge: false,
    });
    const [chiefJudgeExists, setChiefJudgeExists] = useState(false);

    useEffect(() => {
        // Fetch existing staff for the training
        async function fetchStaff() {
            const response = await fetch(`/api/trainings/${trainingId}/staff`);
            const data = await response.json();
            setStaffList(data);
            setChiefJudgeExists(data.some((staff: any) => staff.chief_judge));
        }
        fetchStaff();
    }, [trainingId]);

    const handleSearch = async () => {
        const results = await searchByUsername(searchQuery );
        if (!results) {
            alert("No users found or an error occurred.");
            return;
        }
        // @ts-ignore
        setSearchResults(results);
    };

    const handleRoleChange = (role: string) => {
        setSelectedRoles((prev) => ({
            ...prev,
            [role]: !prev[role],
        }));
    };

    const handleAddStaff = async (userId: string) => {
        const response = await addStaffAction({
            trainingId,
            userId,
            roles: selectedRoles,
        });
        if (response.success) {
            alert("Staff added successfully!");
            setSearchResults([]);
            setSelectedRoles({
                instructor: false,
                problem_setter: false,
                mentor: false,
                chief_judge: false,
            });
        } else {
            alert(response.error || "Failed to add staff.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Manage Staff</h1>

            {/* Existing Staff List */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Existing Staff</h2>
                <ul className="list-disc pl-6">
                    {staffList.map((staff: any) => (
                        <li key={staff.userId}>
                            {staff.username} - Roles:{" "}
                            {Object.keys(staff.roles)
                                .filter((role) => staff.roles[role])
                                .join(", ")}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Search for Staff */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Add New Staff</h2>
                <input
                    type="text"
                    placeholder="Search by username or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
                <ul className="list-disc pl-6 mt-4">
                    {searchResults.map((user: any) => (
                        <li key={user.username} className="mb-2">
                            {user.username}
                            <div className="flex items-center gap-4 mt-2">
                                {/* Role Checkboxes */}
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.instructor}
                                            onChange={() => handleRoleChange("instructor")}
                                        />
                                        Instructor
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.problem_setter}
                                            onChange={() => handleRoleChange("problem_setter")}
                                        />
                                        Problem Setter
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.mentor}
                                            onChange={() => handleRoleChange("mentor")}
                                        />
                                        Mentor
                                    </label>
                                </div>
                                {!chiefJudgeExists && (
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.chief_judge}
                                                onChange={() => handleRoleChange("chief_judge")}
                                            />
                                            Chief Judge
                                        </label>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleAddStaff(user.userId)}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Add
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}