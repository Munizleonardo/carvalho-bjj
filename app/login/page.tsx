"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data?.error ?? "Senha inválida.");
      setLoading(false);
      return;
    }

    router.push("/admin/inscricoes");
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className=" max-w-sm">
        <Link
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          href="/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Voltar para o início
        </Link>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="mb-4 text-center">
            <div className="mx-auto p-3 rounded-xl w-fit mb-4">
            <Image alt="logo" src="/logo.jpeg" width={200} height={100} />
            </div>

            <h3 className="text-xl font-semibold text-foreground">Área Administrativa</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Digite a senha para acessar o painel
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2 mb-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha"
                className="rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              className="cursor-pointer w-full rounded-xl h-12"
              type="submit"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
