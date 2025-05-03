import { Button } from "@/components/ui/button";
import AddToLocalStorage from "@/components/util/AddToLocalStorage";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import "server-only";

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

  // display all the block and show if
  // also material[number].material are an array
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b">Material Title</th>
            <th className="px-4 py-2 text-left border-b">Block Number</th>
            <th className="px-4 py-2 text-left border-b">Deleted</th>
            <th className="px-4 py-2 text-left border-b">Material Details</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(({ blockNumber, deleted, title, material }) => (
            <tr key={blockNumber} className="border-b">
              <AddToLocalStorage
                key_={blockNumber.toString()}
                value={JSON.stringify(material)}
              />
              <td className="px-4 py-2">{title}</td>
              <td className="px-4 py-2">Block {blockNumber}</td>
              <td className="px-4 py-2">{deleted ? "Yes" : "No"}</td>
              <td className="px-4 py-2">
                <table className="min-w-full table-auto">
                  <tbody>
                    {material.map(({ title, link, des }, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{`Material ${index + 1}`}</td>
                        <td className="px-4 py-2">{title}</td>
                        <td className="px-4 py-2">{link}</td>
                        <td className="px-4 py-2">{des}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td className="px-4 py-2 text-center">
                <Link href={`./materials/edit-materials/${blockNumber}`}>
                  Update Block
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
