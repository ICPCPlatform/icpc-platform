"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function TrainingStaffList({
  staffList,
  onDelete,
}: {
  staffList: {
    username: string;
    instructor: boolean;
    problemSetter: boolean;
    mentor: boolean;
  }[];
  onDelete?: (username: string) => void;
}) {
  // TODO: Replace 'any' with the correct type for the API response if available

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Training Staff</CardTitle>
      </CardHeader>
      <CardContent>
        {staffList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No staff found for this training.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "var(--muted)" }}>
                  <TableHead>Username</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Problem Setter</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((staff) => (
                  <TableRow key={staff.username}>
                    <TableCell>{staff.username}</TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: staff.instructor
                            ? "var(--green-100)"
                            : "var(--muted)",
                          color: staff.instructor
                            ? "var(--green-800)"
                            : "var(--muted-foreground)",
                        }}
                      >
                        {staff.instructor ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: staff.problemSetter
                            ? "var(--blue-100)"
                            : "var(--muted)",
                          color: staff.problemSetter
                            ? "var(--blue-800)"
                            : "var(--muted-foreground)",
                        }}
                      >
                        {staff.problemSetter ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: staff.mentor
                            ? "var(--purple-100)"
                            : "var(--muted)",
                          color: staff.mentor
                            ? "var(--purple-800)"
                            : "var(--muted-foreground)",
                        }}
                      >
                        {staff.mentor ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {onDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          style={{ backgroundColor: "var(--red-100)", color: "var(--red-700)" }}
                          onClick={() => onDelete(staff.username)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
