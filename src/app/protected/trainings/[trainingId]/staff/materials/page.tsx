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
                        <Card key={index} className="p-2">
                          <CardContent className="p-2">
                            <div className="grid gap-1">
                              <p className="text-sm font-medium">Material {index + 1}</p>
                              <p className="text-sm">{title}</p>
                              <a href={link} className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                {link}
                              </a>
                              <p className="text-sm text-muted-foreground">{des}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline">
                      <Link href={`./materials/edit-materials/${blockNumber}`}>
                        Update Block
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
