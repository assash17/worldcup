import Link from "next/link";
import { isPlaceholderTeam } from "@/lib/flags/team-codes";
import { getTeamHref } from "@/lib/team-links";
import { TeamFlag } from "./TeamFlag";

interface TeamNameProps {
  team: string;
  align?: "left" | "right" | "center";
  bold?: boolean;
  flagSize?: number;
  link?: boolean;
  className?: string;
}

const alignClass = {
  left: "justify-start text-left",
  right: "justify-end text-right",
  center: "justify-center text-center",
};

export function TeamName({
  team,
  align = "left",
  bold = false,
  flagSize = 18,
  link = false,
  className = "",
}: TeamNameProps) {
  const content = (
    <>
      <TeamFlag team={team} size={flagSize} />
      <span className="truncate">{team}</span>
    </>
  );

  const classNames = `inline-flex min-w-0 items-center gap-1.5 ${alignClass[align]} ${
    bold ? "font-bold text-[var(--wc-green)]" : ""
  } ${className}`;

  if (link && !isPlaceholderTeam(team)) {
    return (
      <Link href={getTeamHref(team)} className={`${classNames} hover:underline`}>
        {content}
      </Link>
    );
  }

  return <span className={classNames}>{content}</span>;
}
