import { Dictionary } from "@/src/lib/dictionaries";
import Link from "next/link";

interface FooterProps {
  i18n: Dictionary["translation"]["footer"];
}

export default function Footer({ i18n }: FooterProps) {
  return (
    <footer className="bg-muted py-6">
      <div className="container mx-auto grid grid-cols-1 gap-3 px-3 text-center md:px-6 lg:grid-cols-3 lg:gap-6 lg:text-left xl:max-w-5xl">
        <p className="text-muted-foreground col-span-1 text-sm">
          {i18n.copyright}
        </p>
        <p className="text-muted-foreground text-sm">{i18n.builtBy}</p>
        <p className="text-muted-foreground text-sm">
          {i18n.hostedBy}&nbsp;
          <Link
            href="https://vercel.com/"
            className="text-primary cursor-pointer underline hover:no-underline"
            target="_blank"
          >
            Vercel
          </Link>
        </p>
      </div>
    </footer>
  );
}
