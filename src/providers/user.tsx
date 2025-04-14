"use client";
import { type UserDataJWT } from "@/lib/session";
import { createContext, useContext } from "react";
const userContext = createContext<UserDataJWT | null>(null);
export default function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserDataJWT | null;
}) {
  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}
export function useUserContext() {
  return useContext(userContext);
}
