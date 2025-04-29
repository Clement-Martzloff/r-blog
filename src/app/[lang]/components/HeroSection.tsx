"use client";

import BenderAvatar from "@/src/app/[lang]/[slug]/components/BenderAvatar";
import CallToActionButton from "@/src/app/[lang]/[slug]/components/CallToActionButton";
import { Dictionary } from "@/src/lib/dictionaries";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaBinoculars } from "react-icons/fa";
import { annotate } from "rough-notation";

interface HeroSectionProps {
  i18n: Dictionary["translation"]["homePage"] &
    Dictionary["translation"]["paths"];
}

export default function HeroSection({ i18n }: HeroSectionProps) {
  const highLightRef = useRef<HTMLHeadingElement>(null);
  const [lang] = usePathname().split("/").filter(Boolean);

  useEffect(() => {
    if (highLightRef.current) {
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--secondary")
        .trim();
      const annotation = annotate(highLightRef.current, {
        padding: -2,
        type: "underline",
        color: primaryColor || "yellow",
        strokeWidth: 3,
        iterations: 3,
      });
      annotation.show();
    }
  }, []);

  return (
    <section className="container mx-auto px-3 py-6 md:px-6 lg:max-w-3xl xl:max-w-4xl">
      <div className="flex flex-col items-center">
        <BenderAvatar className="fill-foreground h-28 w-28 md:mb-3 md:h-48 md:w-48" />
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {i18n.heroTitle.replace("{heroHighlightText}", "")}
            <span ref={highLightRef}>{i18n.heroHighlightText}</span>
          </h1>
          <p className="text-muted-foreground text-xl">
            {i18n.heroDescription}
          </p>
          <CallToActionButton
            className="md:mt-2"
            href={`/${lang}/${i18n.projectReveal}`}
            icon={<FaBinoculars />}
            text={i18n.ctaText}
          />
        </div>
      </div>
    </section>
  );
}
