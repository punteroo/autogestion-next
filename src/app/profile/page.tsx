import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/route";
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
