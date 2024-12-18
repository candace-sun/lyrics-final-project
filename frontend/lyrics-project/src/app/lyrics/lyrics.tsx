"use client";
import { useSearchParams } from "next/navigation";

export default function Lyrics() {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);
  return (
    <>
      <div className="text-2xl font-bold">{params.get("song")?.toString()}</div>
      <div className="text-base mb-2">{params.get("artist")?.toString()}</div>
    </>
  );
}
