import { cn } from "@/infrastructure/framework/nextjs/utils/cn";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface CallToActionButtonProps {
  className?: string;
  href: string;
  icon?: ReactNode;
  text: string;
  targetBlank?: boolean;
}

export default function CallToActionButton({
  className,
  href,
  icon,
  text,
  targetBlank,
}: CallToActionButtonProps) {
  const linkProps = targetBlank
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Button asChild className={cn("cursor-pointer", className)} size="lg">
      <Link href={href} {...linkProps}>
        {icon}
        {text}
      </Link>
    </Button>
  );
}
