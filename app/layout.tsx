import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Carvalho Team - Campeonato de Jiu-Jitsu",
  description: "Carvalho Team - Escola de Jiu-Jitsu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
