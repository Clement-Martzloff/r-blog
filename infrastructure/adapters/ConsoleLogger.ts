import { ILogger } from "@/core/ports/ILogger";

export class ConsoleLogger implements ILogger {
  error(message: string, context?: unknown): void {
    console.error(`[ERROR]: ${message}`, context);
  }
  info(message: string): void {
    console.info(`[INFO]: ${message}`);
  }
}
