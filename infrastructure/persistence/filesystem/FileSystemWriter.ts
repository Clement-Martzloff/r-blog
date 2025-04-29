import { defaultLocale } from "@/config/i18n";
import { InfraStructureError } from "@/core/domain/errors";
import { IFileWriter } from "@/core/ports/IFileWriter";
import { slugify } from "@/infrastructure/utils/format";
import { promises as fs } from "fs";
import path from "path";

export class FileSystemFileWriter implements IFileWriter {
  async write(title: string, content: string): Promise<void> {
    try {
      const slug = slugify(title);
      const filePath = path.join(
        process.cwd(),
        `content/posts/${defaultLocale}/${slug}.mdx`,
      );
      await fs.writeFile(filePath, content);
    } catch (error: unknown) {
      throw new InfraStructureError(
        `An error occurred while writing "${title}"`,
        error,
      );
    }
  }
}
