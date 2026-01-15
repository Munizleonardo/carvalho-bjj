"use client";

import { isAuthenticated } from "@/app/_lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Verificando autenticação...</div>
      </div>
    );
  }

  return <>{children}</>;
}
