import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/firebase-admin";
import TypeWriterText from "@/components/TypeWriterText";
import DividerComponent from "@/components/DividerComponent";
import Regions from "@/components/Regions";
import SignOutButton from "@/components/SignOutButton";
import { getRegions } from "@/lib/firebase/firestore";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");
  const regions = await getRegions(currentUser.uid);

  return (
    <main className="container py-12">
      <section className="flex justify-between items-center text-6xl min-h-[100px]">
        <TypeWriterText finalText="Vanrakshak - Dashboard" />
        <SignOutButton />
      </section>
      <DividerComponent />
      <Regions regions={regions} />
    </main>
  );
}
