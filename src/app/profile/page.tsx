import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import MainDashboard from "../components/Dashboard/MainDashboard";
import ProfilePanel from "../components/Profile/ProfilePanel";

export default async function Profile() {
  const session = await auth();

  if (!session || !session?.user) return redirect("/");

  return (
    <MainDashboard>
      <ProfilePanel />
    </MainDashboard>
  );
}
