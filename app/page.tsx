import { redirect } from "next/navigation";
import { DEFAULT_YEAR } from "@/lib/openfootball/years";

export default function Home() {
  redirect(`/groups?year=${DEFAULT_YEAR}`);
}
