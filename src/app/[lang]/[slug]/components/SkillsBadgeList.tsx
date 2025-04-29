import { Badge } from "@/src/components/ui/badge";

interface SkillsBadgeListProps {
  skills: string[];
}

export default function SkillsBadgeList({ skills }: SkillsBadgeListProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pt-4">
      {skills.map((skill) => (
        <Badge variant="outline" key={skill}>
          {skill}
        </Badge>
      ))}
    </div>
  );
}
