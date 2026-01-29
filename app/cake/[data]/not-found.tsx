import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎂</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Cake Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          This cake link seems to be invalid or expired.
        </p>
        <Link href="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Create a new cake
          </Button>
        </Link>
      </div>
    </main>
  );
}
