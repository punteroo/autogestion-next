import { UserSession } from "@/app/api/auth/[...nextauth]/route";

export function isStudentOnOverService(user?: UserSession): boolean {
  return user?.subscription !== undefined;
}
