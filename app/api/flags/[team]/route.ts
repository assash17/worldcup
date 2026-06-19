import { NextResponse } from "next/server";
import { lookupTeamFlag } from "@/lib/flags/lookup";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ team: string }> },
) {
  const { team: teamParam } = await params;
  const team = decodeURIComponent(teamParam);

  if (!team.trim()) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  const result = await lookupTeamFlag(team);
  return NextResponse.json(result);
}
