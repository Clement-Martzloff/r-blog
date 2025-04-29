import { MarkdownDocument } from "@/core/ports/IMdastFactory";

export interface IMdastCompiler {
  compile(document: MarkdownDocument): string;
}
