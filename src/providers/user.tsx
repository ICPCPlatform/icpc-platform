"use client";
import { type userData } from "@/lib/session";
import { createContext, useContext } from "react";
const userContext = createContext<userData | null>(null);
export default function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: userData|null;
}) {
  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}
export function useUserContext(){
  return useContext(userContext);
}
