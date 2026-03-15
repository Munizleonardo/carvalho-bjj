import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carvalho BJJ",
  description:
    "Campeonato de Jiu-Jitsu com inscricao, informacoes oficiais e comunicacao preparada para cada edicao.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
