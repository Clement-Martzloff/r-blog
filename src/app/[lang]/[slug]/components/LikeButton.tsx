"use client";

import {
  ActionState,
  likePost,
} from "@/infrastructure/framework/nextjs/actions/like";
import { ConfettiButton } from "@src/components/magicui/confetti";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

interface LikeButtonProps {
  initialLikes: number;
  likeLabel: string;
}

export default function LikeButton({
  initialLikes,
  likeLabel,
}: LikeButtonProps) {
  const [lang, slug] = usePathname().split("/").filter(Boolean);
  const [likes, setLikes] = useState<number>(initialLikes);
  const [state, action, pending] = useActionState(likePost, {} as ActionState);

  useEffect(() => {
    if (Object.keys(state).length > 0) {
      if (state.success === false) {
        setLikes((prevLikes) => prevLikes - 1);
      }
    }
  }, [state]);

  return (
    <form action={action}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="lang" value={lang} />
      <ConfettiButton
        type="submit"
        size="sm"
        variant="outline"
        className="cursor-pointer"
        disabled={pending}
        options={{
          particleCount: 100,
          spread: 70,
          scalar: 0.8,
          shapes: ["circle"],
          colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
        }}
        aria-label={likeLabel}
      >
        <div className="flex items-center gap-1" onClick={handleOptimisticLike}>
          <FaHeart className="size-3" />
          <span className="relative top-[1px] text-sm font-bold">{likes}</span>
        </div>
      </ConfettiButton>
    </form>
  );

  function handleOptimisticLike() {
    setLikes((prevLikes) => prevLikes + 1);
  }
}
