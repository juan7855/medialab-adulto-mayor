import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import EmergenciaFlotante from "@/components/EmergenciaFlotante";

// Poppins, la tipografía del Figma. Sin 800: los pesos 800 del código caen
// en 700 (Bold), que es el más grueso que usa el diseño.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Panela – App de Salud para Adultos Mayores",
  description:
    "Aplicación de salud simplificada para adultos mayores: ejercicios, nutrición, medicamentos y rutina diaria.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
  userScalable: true,
  themeColor: "#FBF6EC",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body>
        {children}
        <EmergenciaFlotante />
      </body>
    </html>
  );
}
