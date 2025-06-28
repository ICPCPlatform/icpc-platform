import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";

export type SeedUserStatus = {
  user: string;
  status: string;
  dbUser?: any;
  password: string;
};

export async function ensureDefaultUsers(): Promise<SeedUserStatus[]> {
  const defaultUsers = [
    {
      username: "IcpcPlatform",
      gmail: "icpcplatform@gmail.com",
      password: "Admin@123",
      role: "admin",
      cfHandle: "IcpcPlatform",
      vjHandle: "icpcPlatform",
      phoneNumber: "+2010000000000",
    },
    {
      username: "AmeerJoy",
      gmail: "AmeerJoy@gmail.com",
      password: "User@1234",
      role: "user",
      cfHandle: "AmeerJoy",
      vjHandle: "AmeerJoy",
      phoneNumber: "+2010000000001",
    },
  ];

  const results: SeedUserStatus[] = [];

  for (const user of defaultUsers) {
    // Check for existing user by username, gmail, cfHandle, vjHandle, phoneNumber
    const exists = await db
      .select()
      .from(Users)
      .where(
        or(
          eq(Users.username, user.username),
          eq(Users.gmail, user.gmail),
          eq(Users.cfHandle, user.cfHandle),
          eq(Users.vjHandle, user.vjHandle),
          eq(Users.phoneNumber, user.phoneNumber),
        ),
      )
      .execute();
    if (exists.length > 0) {
      results.push({ user: user.gmail, status: "already exists", dbUser: exists[0], password: user.password });
      continue;
    }
    // Hash password
    const hashed = await bcrypt.hash(user.password, 10);
    // Insert into Users
    const [inserted] = await db
      .insert(Users)
      .values({
        username: user.username,
        gmail: user.gmail,
        password: hashed,
        role: user.role as "admin" | "user",
        cfHandle: user.cfHandle,
        vjHandle: user.vjHandle,
        phoneNumber: user.phoneNumber,
      })
      .returning();
    // Insert into UsersFullData
    await db.insert(UsersFullData).values({ userId: inserted.userId }).execute();
    results.push({ user: user.gmail, status: "created", dbUser: inserted, password: user.password });
  }

  return results;
} 