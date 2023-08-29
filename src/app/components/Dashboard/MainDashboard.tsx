import NavBar from "../NavBar";
import { auth } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MainDashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session?.user) return redirect("/login");

  return (
    <main className="dark text-foreground bg-background">
      <NavBar />
      <div className="w-full h-full py-4">{children}</div>
    </main>
  );
}
