"use client";
import { type userData } from "@/lib/session";
import { createContext } from "react";
import { useContext } from "react";
const userContext = createContext({
  userId: -1,
  username: "",
  role: "",
});
export function getUser() {
  return useContext(userContext);
}
export default function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: userData;
}) {
  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}
