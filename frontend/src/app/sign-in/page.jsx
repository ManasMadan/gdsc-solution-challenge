import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/firebase-admin";
import SignInPage from "@/components/SignInPage";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/dashboard");

  return <SignInPage />;
}
