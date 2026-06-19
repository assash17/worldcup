import { TeamFlag } from "./TeamFlag";

interface TeamNameProps {
  team: string;
  align?: "left" | "right" | "center";
  bold?: boolean;
  flagSize?: number;
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
  className = "",
}: TeamNameProps) {
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1.5 ${alignClass[align]} ${
        bold ? "font-bold text-[var(--wc-green)]" : ""
      } ${className}`}
    >
      <TeamFlag team={team} size={flagSize} />
      <span className="truncate">{team}</span>
    </span>
  );
}
