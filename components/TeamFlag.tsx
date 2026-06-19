"use client";

import { useState } from "react";
import { getTeamFlagUrl } from "@/lib/flags/team-codes";

interface TeamFlagProps {
  team: string;
  size?: number;
  className?: string;
}

function FlagPlaceholder({
  size,
  className,
}: {
  size: number;
  className: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-sm bg-gray-100 text-[10px] font-medium text-gray-400 ${className}`}
      style={{ width: Math.round(size * 1.5), height: size }}
      aria-hidden
    >
      ?
    </span>
  );
}

export function TeamFlag({ team, size = 20, className = "" }: TeamFlagProps) {
  const [failed, setFailed] = useState(false);
  const flagUrl = getTeamFlagUrl(team, Math.max(40, size * 2));

  if (!flagUrl || failed) {
    return <FlagPlaceholder size={size} className={className} />;
  }

  const width = Math.round(size * 1.5);
  const height = size;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`inline-block shrink-0 rounded-sm object-cover shadow-sm ${className}`}
    />
  );
}
