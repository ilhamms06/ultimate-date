import { Nunito, Baloo_2, Playfair_Display } from "next/font/google";
import { IconGradientDefs } from "@/components/GradientIcon";
import { ContentProvider } from "@/components/ContentProvider";
import { getServerAnonClient } from "@/lib/supabase/server";
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

const META_FALLBACK = {
  title: "Maukah Kamu Kencan Denganku?",
  description: "Undangan kecil yang manis, khusus buat kamu",
};

const META_ICONS = {
  icon: [{ url: "/main-logo.png", type: "image/png" }],
  shortcut: ["/main-logo.png"],
  apple: [{ url: "/main-logo.png" }],
};

export async function generateMetadata() {
  const sb = getServerAnonClient();
  if (!sb) return { ...META_FALLBACK, icons: META_ICONS };
  try {
    const { data } = await sb
      .from("content")
      .select("key,value")
      .in("key", ["meta.title", "meta.description"]);
    const map = {};
    (data ?? []).forEach((r) => (map[r.key] = r.value));
    return {
      title: map["meta.title"] || META_FALLBACK.title,
      description: map["meta.description"] || META_FALLBACK.description,
      icons: META_ICONS,
    };
  } catch {
    return { ...META_FALLBACK, icons: META_ICONS };
  }
}

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
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
