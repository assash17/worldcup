import {
  formatFinalScoreDisplay,
  hasPenalties,
  type MatchScoreInput,
} from "@/lib/match-score";

interface MatchScoreDisplayProps extends MatchScoreInput {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: {
    score: "text-xs font-bold text-[var(--wc-green)]",
    pen: "text-[10px] text-amber-700",
    penPrefix: "pen",
  },
  md: {
    score: "font-semibold text-[var(--wc-green)]",
    pen: "text-xs text-amber-700",
    penPrefix: "pen",
  },
  lg: {
    score: "text-3xl font-bold text-[var(--wc-green)]",
    pen: "text-sm text-amber-700",
    penPrefix: "Penalties",
  },
} as const;

export function MatchScoreDisplay({
  homeScore,
  awayScore,
  htHomeScore = null,
  htAwayScore = null,
  etHomeScore = null,
  etAwayScore = null,
  homePenalties = null,
  awayPenalties = null,
  played,
  size = "md",
  className = "",
}: MatchScoreDisplayProps) {
  const scores: MatchScoreInput = {
    homeScore,
    awayScore,
    htHomeScore,
    htAwayScore,
    etHomeScore,
    etAwayScore,
    homePenalties,
    awayPenalties,
    played,
  };
  const scoreText = formatFinalScoreDisplay(scores);
  const showPenalties = hasPenalties(scores);
  const styles = sizeStyles[size];

  return (
    <span className={`inline-flex flex-col items-center leading-tight ${className}`}>
      <span
        className={`tabular-nums ${styles.score} ${
          scoreText === "-" ? "!text-gray-400" : ""
        }`}
      >
        {scoreText}
      </span>
      {showPenalties ? (
        <span className={styles.pen}>
          {styles.penPrefix} {homePenalties}-{awayPenalties}
        </span>
      ) : null}
    </span>
  );
}
