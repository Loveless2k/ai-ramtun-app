import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import StableNavigation from "@/components/StableNavigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Ramtun - Crucigramas Educativos con IA",
  description: "Plataforma educativa que utiliza IA para generar crucigramas personalizados para profesores de educación básica y media en Chile.",
  keywords: ["educación", "crucigramas", "IA", "Chile", "profesores", "estudiantes"],
  authors: [{ name: "Ramtun Team" }],
  openGraph: {
    title: "Ramtun - Crucigramas Educativos con IA",
    description: "Transforma la educación con crucigramas inteligentes generados por IA",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <StableNavigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
