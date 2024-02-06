import { UserSession } from "./types/auth.types";


export function isStudentOnOverService(user?: UserSession): boolean {
  return user?.subscription !== undefined;
}
