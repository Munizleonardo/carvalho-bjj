"use client";

import { isAuthenticated } from "@/app/_lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter();
  const authed = isAuthenticated();

  useEffect(() => {
    if (!authed) {
      router.push("/");
    }
  }, [authed, router]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Verificando autenticação...</div>
      </div>
    );
  }

  return <>{children}</>;
}
