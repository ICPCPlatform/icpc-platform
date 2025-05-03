import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import "server-only";

export default function Page() {
  
  db.select({material : Blocks.material}).from(Blocks)
  .where(Blocks.trainingId))
  return (
    <div></div>
  )
}

