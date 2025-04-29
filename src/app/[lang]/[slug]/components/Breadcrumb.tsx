"use client";

import { useBreadcrumbItems } from "@/src/app/[lang]/[slug]/hooks/useBreadcrumbItems";
import { useTruncateTitle } from "@/src/hooks/shared/useTruncateTitle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@src/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

interface BreadCrumbProps {
  postTitle: string;
}

export default function BreadCrumb({ postTitle }: BreadCrumbProps) {
  const items = useBreadcrumbItems(postTitle);
  const truncateTitle = useTruncateTitle();

  return (
    <nav className="mt-6">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {"isActive" in item && item.isActive ? (
                  <BreadcrumbPage title={item.label}>
                    {truncateTitle(item.label, 40)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
