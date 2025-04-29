export interface IFileWriter {
  write(title: string, content: string): Promise<void>;
}
