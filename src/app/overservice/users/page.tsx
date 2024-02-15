import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import MainDashboard from "@/app/components/Dashboard/MainDashboard";
import ProfilePanel from "@/app/components/Profile/ProfilePanel";
import { isStudentOnOverService } from "@/lib/subscription.utils";
import { UsersPanel } from "@/app/components/OverServices/Users/UsersPanel";

export default async function OverServiceUsers() {
  const session = await auth();

  if (!session || !session?.user) return redirect("/");

  // Do not allow non OverService students to access.
  if (!isStudentOnOverService(session?.user)) return redirect("/");

  return (
    <MainDashboard>
      <UsersPanel />
    </MainDashboard>
  );
}
