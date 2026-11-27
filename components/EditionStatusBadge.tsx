import type { EditionStatus } from "@/lib/openfootball/edition-status";

const LABELS: Record<Exclude<EditionStatus, "completed">, string> = {
  in_progress: "In progress",
  scheduled: "Scheduled",
};

interface EditionStatusBadgeProps {
  status: EditionStatus;
  className?: string;
}

export function EditionStatusBadge({ status, className = "" }: EditionStatusBadgeProps) {
  if (status === "completed") return null;

  const label = LABELS[status];

  return (
    <span
      className={`inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 ${className}`}
    >
      {label}
    </span>
  );
}