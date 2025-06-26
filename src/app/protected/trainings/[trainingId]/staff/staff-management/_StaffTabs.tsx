"use client";
import { useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AddStaffForm from "./_AddStaffForm";
import SearchUser from "./_SearchUser";
import TrainingStaffList from "./_TrainingStaffList";
import { updateStaff, deleteStaff, searchByUsername } from "./actions";
import { useRouter } from "next/navigation";

// Use the correct type for staffList
export default function StaffTabs({ trainingId, staffList }: { trainingId: number; staffList: Awaited<ReturnType<typeof searchByUsername>> }) {
  const [activeTab, setActiveTab] = useState("add");
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateResult, setUpdateResult] = useState<Awaited<ReturnType<typeof searchByUsername>>[0] | null>(null);
  const [updateRoles, setUpdateRoles] = useState({ instructor: false, problem_setter: false, mentor: false });
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleUpdateSearch(e: React.FormEvent) {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setUpdateResult(null);
    try {
      const res = await searchByUsername(updateUsername, trainingId);
      if (res.length === 0) {
        setUpdateError("User not found");
        return;
      }
      setUpdateResult(res[0]);
      setUpdateRoles({
        instructor: !!res[0].instructor,
        problem_setter: !!res[0].problemSetter,
        mentor: !!res[0].mentor,
      });
    } catch (err: unknown) {
      setUpdateError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setUpdateError("");
      setUpdateSuccess("");
      try {
        await updateStaff({
          trainingId,
          username: updateUsername,
          roles: updateRoles,
        });
        setUpdateSuccess("Staff roles updated successfully");
        router.refresh();
      } catch (err: unknown) {
        setUpdateError(err instanceof Error ? err.message : "Unknown error");
      }
    });
  }

  async function handleDelete(username: string) {
    if (!window.confirm(`Are you sure you want to delete staff: ${username}?`)) return;
    startTransition(async () => {
      try {
        await deleteStaff({ trainingId, username });
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to delete staff");
      }
    });
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-row justify-center">
      <TabsList className="self-center ">
        <TabsTrigger value="add">Add Staff</TabsTrigger>
        <TabsTrigger value="search">Search User</TabsTrigger>
        <TabsTrigger value="list">Staff List</TabsTrigger>
        <TabsTrigger value="update">Update Staff</TabsTrigger>
      </TabsList>
      </div>
      <TabsContent value="add">
        <AddStaffForm trainingId={trainingId} />
      </TabsContent>
      <TabsContent value="search">
        <SearchUser trainingId={trainingId} />
      </TabsContent>
      <TabsContent value="list">
        <TrainingStaffList
          staffList={staffList.map((s) => ({
            username: s.username,
            instructor: s.instructor ?? false,
            problemSetter: s.problemSetter ?? false,
            mentor: s.mentor ?? false,
          }))}
          onDelete={handleDelete}
        />
      </TabsContent>
      <TabsContent value="update">
        <form onSubmit={handleUpdateSearch} className="mb-4 flex gap-2 items-end">
          <div className="flex-1">
            <label htmlFor="update-username">Username</label>
            <input
              id="update-username"
              type="text"
              value={updateUsername}
              onChange={e => setUpdateUsername(e.target.value)}
              required
              placeholder="Enter username"
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        {updateError && <div className="mb-2 text-red-600">{updateError}</div>}
        {updateSuccess && <div className="mb-2 text-green-600">{updateSuccess}</div>}
        {updateResult && (
          <form onSubmit={handleUpdateSubmit} className="space-y-2">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={updateRoles.instructor}
                  onChange={e => setUpdateRoles(r => ({ ...r, instructor: e.target.checked }))}
                />
                Instructor
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={updateRoles.problem_setter}
                  onChange={e => setUpdateRoles(r => ({ ...r, problem_setter: e.target.checked }))}
                />
                Problem Setter
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={updateRoles.mentor}
                  onChange={e => setUpdateRoles(r => ({ ...r, mentor: e.target.checked }))}
                />
                Mentor
              </label>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Staff Roles"}
            </Button>
          </form>
        )}
      </TabsContent>
    </Tabs>
  );
} 