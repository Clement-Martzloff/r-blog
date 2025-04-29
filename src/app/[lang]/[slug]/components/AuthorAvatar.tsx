import BenderAvatar from "@/src/app/[lang]/[slug]/components/BenderAvatar";
import FryAvatar from "@/src/app/[lang]/[slug]/components/FryAvatar";

interface AuthorAvatarProps {
  author: string;
  dateString: string;
}

export default function AuthorAvatar({
  author,
  dateString,
}: AuthorAvatarProps) {
  const avatarSrc =
    author === "Otto Mation" ? (
      <BenderAvatar className="fill-foreground h-10 w-10 rounded-full" />
    ) : (
      <FryAvatar />
    );

  return (
    <div className="flex items-center space-x-2">
      {avatarSrc}
      <div className="text-sm">
        <p className="font-medium">{author}</p>
        <p className="text-muted-foreground">{dateString}</p>
      </div>
    </div>
  );
}
