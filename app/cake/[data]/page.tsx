import { decodeCakeData } from "@/lib/cake-encoding";
import { CakeDisplay } from "@/components/cake/cake-display";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface PageProps {
  params: Promise<{
    data: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { data } = await params;
  const cakeData = decodeCakeData(data);

  if (!cakeData) {
    return {
      title: "Cake Not Found",
    };
  }

  return {
    title: "Happy Birthday!",
    description: cakeData.message || "Blow out the candles on this virtual birthday cake!",
  };
}

export default async function CakePage({ params }: PageProps) {
  const { data } = await params;
  const cakeData = decodeCakeData(data);

  if (!cakeData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto">
        <CakeDisplay data={cakeData} />

        <div className="flex justify-center mt-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home className="w-4 h-4" />
              Create your own cake
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
