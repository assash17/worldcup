import { NextResponse } from "next/server";
import { fetchWorldCupData } from "@/lib/openfootball/fetch";
import { isValidYear } from "@/lib/openfootball/years";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ year: string }> },
) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);

  if (!isValidYear(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const data = await fetchWorldCupData(year);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load World Cup data";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
