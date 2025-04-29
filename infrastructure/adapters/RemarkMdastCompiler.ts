import { InfraStructureError } from "@/core/domain/errors";
import { IMdastCompiler } from "@/core/ports/IMdastCompiler";
import { MarkdownDocument } from "@/core/ports/IMdastFactory";
import yaml from "js-yaml";
import { Root } from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkGemoji from "remark-gemoji";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

export class RemarkMdastCompiler implements IMdastCompiler {
  compile(document: MarkdownDocument): string {
    try {
      const tree: Root = {
        type: "root",
        children: [
          {
            type: "yaml",
            value: yaml.dump(document.frontmatter),
          },
          ...document.body,
        ],
      };
      const markdown = unified()
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkGemoji)
        .use(remarkStringify)
        .stringify(tree);
      return markdown;
    } catch (error: unknown) {
      throw new InfraStructureError(
        "An error occurred while generating markdown",
        error,
      );
    }
  }
}
