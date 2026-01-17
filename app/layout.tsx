import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Black Belt - BJJ",
  description: "Black Belt - BJJ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
