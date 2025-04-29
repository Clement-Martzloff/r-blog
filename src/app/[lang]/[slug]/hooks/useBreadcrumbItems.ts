"use client";

import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export function useBreadcrumbItems(lastSegmentLabel: string): BreadcrumbItem[] {
  const pathname = usePathname();
  const [lang, ...restSegments] = pathname.split("/").filter(Boolean);

  return [
    { label: "Home", href: `/${lang}` },
    ...restSegments.map((segment, index) => {
      const isLast = index === restSegments.length - 1;
      return {
        label: isLast ? lastSegmentLabel : capitalize(segment),
        href: `/${lang}/${restSegments.slice(0, index + 1).join("/")}`,
        isActive: isLast,
      };
    }),
  ];
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
