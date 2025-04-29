"use client";

import ThemeToggler from "@/src/components/shared/ThemeToggler";
import { Dictionary } from "@/src/lib/dictionaries";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  i18n: Dictionary["translation"]["header"] &
    Dictionary["translation"]["paths"];
}

export default function Header({ i18n }: HeaderProps) {
  const [lang] = usePathname().split("/").filter(Boolean);
  return (
    <div className="border-b-1">
      <div className="container mx-auto px-3 md:px-6 xl:max-w-5xl">
        <header className="py-2">
          <nav className="flex w-full max-w-screen-xl items-center justify-between">
            <Link
              href={`/${lang}`}
              className="cursor-pointer leading-tight font-bold"
            >
              {i18n.title}
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href={`/${lang}/${i18n.whoAmI}`}
                className="text-primary text-sm font-bold underline transition-colors hover:no-underline"
              >
                {i18n.whoAmILink}
              </Link>
              <ThemeToggler />
            </div>
          </nav>
        </header>
      </div>
    </div>
  );
}
