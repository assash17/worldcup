"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWorldCupYears } from "@/lib/hooks/useWorldCupYears";

export default function Home() {
  const router = useRouter();
  const { defaultYear, loading } = useWorldCupYears();

  useEffect(() => {
    if (!loading) {
      router.replace(`/groups?year=${defaultYear}`);
    }
  }, [router, defaultYear, loading]);

  return <p className="text-gray-500">Loading...</p>;
}
