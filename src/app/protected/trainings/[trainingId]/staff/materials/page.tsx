import { Button } from "@/components/ui/button";
import AddToLocalStorage from "@/components/util/AddToLocalStorage";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import "server-only";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PencilIcon } from "lucide-react";
import ExpandableMaterialCard from "@/components/ExpandableMaterialCard";

export default async function Page({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId: trainingIdStr } = await params;
  const trainingId = Number(trainingIdStr);

  if (isNaN(trainingId)) {
    redirect("not-found");
  }

  const materials = await db
    .select({
      material: Blocks.material,
      blockNumber: Blocks.blockNumber,
      deleted: Blocks.deleted,
      title: Blocks.title,
    })
    .from(Blocks)
    .where(eq(Blocks.trainingId, trainingId))
    .orderBy(Blocks.blockNumber);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Training Materials</CardTitle>
          <CardDescription>Manage and view all training materials</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Title</TableHead>
                <TableHead>Block Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Material Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map(({ blockNumber, deleted, title, material }) => (
                <TableRow key={blockNumber}>
                  <AddToLocalStorage
                    key_={blockNumber.toString()}
                    value={JSON.stringify(material)}
                  />
                  <TableCell className="font-medium">{title}</TableCell>
                  <TableCell>Block {blockNumber}</TableCell>
                  <TableCell>
                    <Badge variant={deleted ? "destructive" : "default"}>
                      {deleted ? "Deleted" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {material.map(({ title, link, des }, index) => (
                        <ExpandableMaterialCard
                          key={index}
                          title={title}
                          link={link}
                          des={des}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline">
                      <Link href={`./materials/edit-materials/${blockNumber}`}>
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
