"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DEFAULT_YEAR } from "@/lib/openfootball/years";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/groups?year=${DEFAULT_YEAR}`);
  }, [router]);

  return <p className="text-gray-500">Loading...</p>;
}
