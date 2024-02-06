import { StudentRole } from "../objects/student.roles";

export interface UserSession {
  academicId: number;
  firstName: string;
  lastName: string;
  dni: number;
  hash: string;
  career: {
    id: number;
    code: number;
    name: string;
  };
  subscription?: {
    role: StudentRole;
    profilePicture?: string;
    email?: string;
    phone?: string;
    createdAt: string;
  };
}
