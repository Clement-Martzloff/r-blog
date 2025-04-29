import { locales } from "@/config/i18n";
import { cn } from "@/infrastructure/framework/nextjs/utils/cn";
import Footer from "@/src/components/shared/Footer";
import Header from "@/src/components/shared/Header";
import ThemeProvider from "@/src/components/shared/ThemeProvider";
import { getDictionary } from "@/src/lib/dictionaries";
import { DM_Sans, Space_Mono } from "next/font/google";
import "../globals.css";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body className={cn(dmSans.variable, spaceMono.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col justify-between">
            <Header
              i18n={{
                ...dictionary.translation.header,
                ...dictionary.translation.paths,
              }}
            />
            {children}
            <Footer i18n={dictionary.translation.footer} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
