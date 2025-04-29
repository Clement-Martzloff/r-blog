"use server";

import { DomainError, InfraStructureError } from "@/core/domain/errors";
import { LikePostUseCase } from "@/core/usecases/LikePostUseCase";
import { ConsoleLogger } from "@/infrastructure/adapters/ConsoleLogger";
import { DrizzleLikeRepository } from "@/infrastructure/persistence/drizzle/DrizzleLikeRepository";
import { revalidatePath } from "next/cache";

const consoleLogger = new ConsoleLogger();
const likeRepository = new DrizzleLikeRepository();
const likePostUseCase = new LikePostUseCase(likeRepository);

export interface ActionState {
  success: boolean;
  message?: string;
}

export async function likePost(
  _: ActionState,
  queryData: FormData,
): Promise<ActionState> {
  try {
    const slug = queryData.get("slug") as string;
    const locale = queryData.get("locale") as string;
    await likePostUseCase.execute(slug);
    revalidatePath(`/${locale}/${slug}`);
    return {
      success: true,
      message: "Post liked successfully",
    };
  } catch (error: unknown) {
    if (error instanceof InfraStructureError) {
      consoleLogger.error(
        `Infrastructure error while liking post: ${error.message}`,
        error,
      );
    }
    if (error instanceof DomainError) {
      consoleLogger.error(
        `Domain error while error while liking post: ${error.message}`,
        error,
      );
    }
    consoleLogger.error("An unknown error occurred while liking post", error);
    return {
      success: false,
      message: "An unknown error occurred while liking post",
    };
  }
}
