import { db } from "@/lib/db";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Landing Page</h1>
      <Link href="/dashboard" className="underline">
        Dashboard
      </Link>
    </>
  );
}
