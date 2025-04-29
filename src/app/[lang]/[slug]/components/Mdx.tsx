import CallToActionButton from "@/src/app/[lang]/[slug]/components/CallToActionButton";
import SkillsBadgeList from "@/src/app/[lang]/[slug]/components/SkillsBadgeList";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { FaCalendar } from "react-icons/fa";

export default function MDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ CallToActionButton, FaCalendar, SkillsBadgeList }}
    />
  );
}
