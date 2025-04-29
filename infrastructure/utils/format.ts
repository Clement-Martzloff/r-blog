import { Frontmatter } from "@/core/ports/IMdastFactory";

export function normalizeFrontmatterKeys(
  fm: Record<string, unknown>,
): Frontmatter {
  const normalized: Record<string, unknown> = {};
  for (const key in fm) {
    normalized[key.toLowerCase()] = fm[key];
  }
  return {
    title: (normalized["title"] as string) || "",
    date: (normalized["date"] as string) || "",
    author: (normalized["author"] as string) || "",
    tags: (normalized["tags"] as string[]) || [],
  };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}
