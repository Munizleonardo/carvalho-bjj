"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/ui/table";
import { logout } from "@/app/_lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PainelAdministrativo() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gerenciamento de inscrições</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/categorias">
                <Button
                  variant="outline"
                  className="h-9 rounded-xl px-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  Categorias
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="h-9 rounded-xl px-3 text-muted-foreground"
                type="button"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards resumo */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4 py-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Total de inscritos</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4 py-4">
              <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              </div>

              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Aprovados</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4 py-4">
              <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-amber-600 dark:text-amber-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>

              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>

                <Input
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pl-10 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Buscar por nome ou WhatsApp..."
                  value=""
                  readOnly
                />
              </div>

              <Button
                type="button"
                role="combobox"
                aria-expanded="false"
                className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-40"
              >
                <span>Todas as faixas</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>

              <Button
                type="button"
                role="combobox"
                aria-expanded="false"
                className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-44"
              >
                <span>Todos os status</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>

              <Button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground">Inscrições (5)</h3>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Atleta</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Idade</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Peso</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Faixa</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</TableHead>
                  <TableHead className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <TableCell className="py-4 px-4">
                        <div>
                            <p className="font-medium text-foreground">João Silva</p>
                            <p className="text-sm text-muted-foreground">(22) 99999-1111</p>
                            <p className="text-xs text-muted-foreground">Academia Top Team</p>
                        </div>
                    </TableCell>
                    
                    <TableCell className="py-4 px-4 text-foreground">28 anos</TableCell>
                    <TableCell className="py-4 px-4 text-foreground">76.5 kg</TableCell>
                    <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border background-color: rgb(30, 64, 175); border-color: rgb(30, 64, 175);"></div>
                                <span className="text-sm">Azul</span>
                        </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Aprovado</span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-sm text-muted-foreground">10/01/2026</TableCell>
                    <TableCell className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Link href="/admin/inscricoes/1">
                                <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye h-4 w-4">
                                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </Button>
                            </Link>
                            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big h-4 w-4">
                                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                    <path d="m9 11 3 3L22 4"></path>
                                </svg>
                            </Button>
                            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x h-4 w-4">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="m15 9-6 6"></path>
                                    <path d="m9 9 6 6"></path>
                                </svg>
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <TableCell className="py-4 px-4">
                        <div>
                            <p className="font-medium text-foreground">Maria Santos</p>
                            <p className="text-sm text-muted-foreground">(22) 99999-2222</p>
                            <p className="text-xs text-muted-foreground">Gracie Barra</p>
                        </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-foreground">25 anos</TableCell>
                    <TableCell className="py-4 px-4 text-foreground">58 kg</TableCell>
                    <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border background-color: rgb(124, 58, 237); border-color: rgb(124, 58, 237);"></div>
                            <span className="text-sm">Roxa</span>
                        </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Pendente</span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-sm text-muted-foreground">11/01/2026</TableCell>
                    <TableCell className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Link href="/admin/inscricoes/2">
                            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye h-4 w-4">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </Button>
                        </Link>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big h-4 w-4">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                            </svg>
                        </Button>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x h-4 w-4">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m15 9-6 6"></path>
                                <path d="m9 9 6 6"></path>
                            </svg>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <TableCell className="py-4 px-4">
                    <div>
                        <p className="font-medium text-foreground">Pedro Costa</p>
                        <p className="text-sm text-muted-foreground">(22) 99999-3333</p>
                    </div>
                </TableCell>
                <TableCell className="py-4 px-4 text-foreground">32 anos</TableCell>
                <TableCell className="py-4 px-4 text-foreground">88.5 kg</TableCell>
                <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border background-color: rgb(120, 53, 15); border-color: rgb(120, 53, 15);"></div>
                        <span className="text-sm">Marrom</span>
                    </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Comprovante Enviado</span>
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-muted-foreground">11/01/2026</TableCell>
                <TableCell className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link href="/admin/inscricoes/3">
                            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye h-4 w-4">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </Button>
                        </Link>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big h-4 w-4">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                            </svg>
                        </Button>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x h-4 w-4">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m15 9-6 6"></path>
                                <path d="m9 9 6 6"></path>
                            </svg>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <TableCell className="py-4 px-4">
                    <div>
                        <p className="font-medium text-foreground">Ana Oliveira</p>
                        <p className="text-sm text-muted-foreground">(22) 99999-4444</p>
                        <p className="text-xs text-muted-foreground">Checkmat</p>
                    </div>
                </TableCell>
                <TableCell className="py-4 px-4 text-foreground">22 anos</TableCell>
                <TableCell className="py-4 px-4 text-foreground">64 kg</TableCell>
                <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border background-color: rgb(255, 255, 255); border-color: rgb(212, 212, 216);"></div>
                        <span className="text-sm">Branca</span>
                    </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Aprovado</span>
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-muted-foreground">12/01/2026</TableCell>
                <TableCell className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link href="/admin/inscricoes/4">
                            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye h-4 w-4">
                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </Button>
                        </Link>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big h-4 w-4">
                            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                            <path d="m9 11 3 3L22 4"></path>
                            </svg>
                        </Button>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m15 9-6 6"></path>
                            <path d="m9 9 6 6"></path>
                            </svg>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <TableCell className="py-4 px-4">
                    <div>
                        <p className="font-medium text-foreground">Carlos Ferreira</p>
                        <p className="text-sm text-muted-foreground">(22) 99999-5555</p>
                        <p className="text-xs text-muted-foreground">Alliance</p>
                    </div>
                </TableCell>
                <TableCell className="py-4 px-4 text-foreground">35 anos</TableCell>
                <TableCell className="py-4 px-4 text-foreground">95 kg</TableCell>
                <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border background-color: rgb(24, 24, 27); border-color: rgb(24, 24, 27);"></div>
                        <span className="text-sm">Preta</span>
                    </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejeitado</span>
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-muted-foreground">12/01/2026</TableCell>
                <TableCell className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link href="/admin/inscricoes/5">
                            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye h-4 w-4">
                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </Button>
                        </Link>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big h-4 w-4">
                            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                            <path d="m9 11 3 3L22 4"></path>
                            </svg>
                        </Button>
                        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-lg text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m15 9-6 6"></path>
                            <path d="m9 9 6 6"></path>
                            </svg>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
