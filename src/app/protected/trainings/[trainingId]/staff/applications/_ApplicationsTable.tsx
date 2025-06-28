"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { handleBulkAction } from "./page";

type Application = {
  applicationId: number;
  userId: string;
  status: string;
  appliedAt: string;
  username: string;
  gmail: string;
};

type ApplicationsTableProps = {
  applications: Application[];
  handleAction: (applicationId: number, userId: string, action: "accept" | "reject" | "pending") => Promise<void>;
};

export default function ApplicationsTable({ applications, handleAction }: ApplicationsTableProps) {
  const [filter, setFilter] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState<"accept"|"reject"|null>(null);

  const filteredApplications = filter === "all"
    ? applications
    : applications.filter((app) => app.status === filter);

  const handleSelect = (id: number, checked: boolean) => {
    setSelected((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
  };

  const handleBulkActionClient = async (action: "accept" | "reject") => {
    setBulkLoading(action);
    const bulk = filteredApplications
      .filter(app => selected.includes(app.applicationId) && app.status !== action)
      .map(app => ({ applicationId: app.applicationId, userId: app.userId, action }));
    if (bulk.length > 0) {
      await handleBulkAction(bulk, Number(filteredApplications[0]?.trainingId || 0));
    }
    setBulkLoading(null);
    setSelected([]);
  };

  const allChecked = selected.length === filteredApplications.length && filteredApplications.length > 0;
  const someChecked = selected.length > 0 && selected.length < filteredApplications.length;
  const masterCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

  return (
    <>
      {/* Filter UI */}
      <div className="mb-4 flex gap-2">
        {["all", "pending", "accepted", "rejected"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mb-4 flex gap-2 items-center bg-muted p-2 rounded">
          <span className="font-medium">Bulk actions for {selected.length} selected:</span>
          <Button
            size="sm"
            onClick={() => handleBulkActionClient("accept")}
            disabled={bulkLoading === "accept"}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {bulkLoading === "accept" ? "Accepting..." : "Accept All"}
          </Button>
          <Button
            size="sm"
            onClick={() => handleBulkActionClient("reject")}
            disabled={bulkLoading === "reject"}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {bulkLoading === "reject" ? "Rejecting..." : "Reject All"}
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-2 py-2 border w-8 text-center">
                <Checkbox
                  ref={masterCheckboxRef}
                  checked={allChecked}
                  onCheckedChange={checked => {
                    if (checked) setSelected(filteredApplications.map(app => app.applicationId));
                    else setSelected([]);
                  }}
                />
              </th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Applied At</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.applicationId}>
                <td className="px-2 py-2 border text-center">
                  <Checkbox
                    checked={selected.includes(app.applicationId)}
                    onCheckedChange={checked => handleSelect(app.applicationId, Boolean(checked))}
                  />
                </td>
                <td className="px-4 py-2 border">{app.username}</td>
                <td className="px-4 py-2 border">{app.gmail}</td>
                <td className="px-4 py-2 border">{new Date(app.appliedAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  <Select
                    value={app.status}
                    onValueChange={async (value: "pending" | "accepted" | "rejected") => {
                      setLoadingId(app.applicationId);
                      let action: "accept" | "reject" | "pending";
                      if (value === "accepted") action = "accept";
                      else if (value === "rejected") action = "reject";
                      else action = value;
                      await handleAction(app.applicationId, app.userId, action);
                      setLoadingId(null);
                    }}
                    disabled={loadingId === app.applicationId}
                  >
                    <SelectTrigger className={`w-32 ${app.status === "accepted" ? "border-green-500" : app.status === "rejected" ? "border-red-500" : "border-yellow-500"}`}>
                      <span className={
                        app.status === "accepted"
                          ? "text-green-600 font-semibold"
                          : app.status === "rejected"
                          ? "text-red-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
} 