import { Suspense } from "react";
import { MatchDetailPage } from "@/components/MatchDetailPage";
import { getAllMatchIds } from "@/lib/openfootball/static-params";

export async function generateStaticParams() {
  return getAllMatchIds();
}

export default function MatchPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <MatchDetailPage />
    </Suspense>
  );
}
