"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { handleBulkAction } from "./actions";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { useParams } from "next/navigation";

type Application = {
  userId: string;
  status: string;
  appliedAt: string;
  username: string;
  gmail: string;
};

type ApplicationsTableProps = {
  applications: Application[];
};

export default function ApplicationsTable({
  applications,
}: ApplicationsTableProps) {
  const { trainingId } = useParams();
  const [filter, setFilter] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState<"accepted" | "rejected" | null>(
    null,
  );

  
  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);
  const someChecked =
    selected.length > 0 && selected.length < filteredApplications.length;
  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

  if (!trainingId) {
    return <div>Error: Training ID is required</div>;
  }

  if (isNaN(Number(trainingId))) {
    return <div>Error: Invalid Training ID</div>;
  }


  const handleSelect = (userId: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, userId] : prev.filter((x) => x !== userId),
    );
  };

  const handleBulkActionClient = async (action: "accepted" | "rejected") => {
    setBulkLoading(action);
    const bulk = filteredApplications
      .filter(
        (app) => selected.includes(app.userId) && app.status !== action,
      )
      .map((app) => ({
        userId: app.userId,
        action,
      }));
    if (bulk.length > 0) {
      await handleBulkAction({bulk: bulk, trainingId : Number(trainingId)});
    }
    setBulkLoading(null);
    setSelected([]);
  };

  const allChecked =
    selected.length === filteredApplications.length &&
    filteredApplications.length > 0;

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

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="mb-4 flex gap-2 items-center bg-muted p-2 rounded">
          <span className="font-medium">
            Bulk actions for {selected.length} selected:
          </span>
          <Button
            size="sm"
            onClick={() => handleBulkActionClient("accepted")}
            disabled={bulkLoading === "accepted"}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {bulkLoading === "accepted" ? "Accepting..." : "Accept All"}
          </Button>
          <Button
            size="sm"
            onClick={() => handleBulkActionClient("rejected")}
            disabled={bulkLoading === "rejected"}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {bulkLoading === "rejected" ? "Rejecting..." : "Reject All"}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-center">
                <Checkbox
                  aria-label="Select all applications"
                  checked={allChecked}
                  onCheckedChange={(checked) => {
                    if (checked)
                      setSelected(
                        filteredApplications.map((app) => app.userId),
                      );
                    else setSelected([]);
                  }}
                />
              </TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.userId}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selected.includes(app.userId)}
                    onCheckedChange={(checked) =>
                      handleSelect(app.userId, Boolean(checked))
                    }
                  />
                </TableCell>
                <TableCell>{app.username}</TableCell>
                <TableCell>{app.gmail}</TableCell>
                <TableCell>
                  {new Date(app.appliedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={app.status}
                    onValueChange={async (
                      value: "pending" | "accepted" | "rejected",
                    ) => {
                      setLoadingId(app.userId);
                      const action =
                        value === "accepted"
                          ? "accepted"
                          : value === "rejected"
                            ? "rejected"
                            : "pending";
                      await handleBulkAction({bulk:[
                        {
                          userId: app.userId,
                          action,
                        },
                      ], trainingId: Number(trainingId)});
                      setLoadingId(null);
                    }}
                    disabled={loadingId === app.userId}
                  >
                    <SelectTrigger
                      className={`w-32 ${
                        app.status === "accepted"
                          ? "border-green-500"
                          : app.status === "rejected"
                            ? "border-red-500"
                            : "border-yellow-500"
                      }`}
                    >
                      <span
                        className={
                          app.status === "accepted"
                            ? "text-green-600 font-semibold"
                            : app.status === "rejected"
                              ? "text-red-600 font-semibold"
                              : "text-yellow-600 font-semibold"
                        }
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
