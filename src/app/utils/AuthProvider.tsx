"use client";
import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>; // ✅ Ensure JSX is returned
};

export default AuthProvider;
