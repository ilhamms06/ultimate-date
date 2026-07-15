import { Nunito, Baloo_2, Playfair_Display } from "next/font/google";
import { IconGradientDefs } from "@/components/GradientIcon";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Maukah Kamu Pergi Kencan Denganku?",
  description: "Undangan kecil yang manis, khusus untukmu",
};

export const viewport = {
  themeColor: "#ffb6d5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${nunito.variable} ${baloo.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <IconGradientDefs />
        {children}
      </body>
    </html>
  );
}
