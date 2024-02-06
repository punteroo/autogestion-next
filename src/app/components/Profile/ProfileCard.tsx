"use client";

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
} from "@nextui-org/react";
import { NexusLogo } from "../Icons/NexusLogo";
import { useSession } from "next-auth/react";
import { StudentRole } from "@/lib/objects/student.roles";
import { BookIcon } from "../Icons/BookIcon";
import { BankNotesIcon } from "../Icons/BankNotesIcon";
import { CodeBracketIcon } from "../Icons/CodeBracketIcon";
import { StarIcon } from "../Icons/StarIcon";
import { isStudentOnOverService } from "@/lib/subscription.utils";

export default function ProfileCard() {
  const { data: session } = useSession();

  const user = session?.user;

  function parseStudentRole(role: StudentRole | null): React.ReactNode {
    switch (role) {
      case StudentRole.STUDENT: {
        return (
          <Chip size="sm" color="default" startContent={<BookIcon />}>
            Estudiante
          </Chip>
        );
      }
      case StudentRole.COLLABORATOR: {
        return (
          <Chip size="sm" color="success" startContent={<BankNotesIcon />}>
            Colaborador
          </Chip>
        );
      }
      case StudentRole.DEVELOPER: {
        return (
          <Chip size="sm" color="warning" startContent={<CodeBracketIcon />}>
            Desarrollador
          </Chip>
        );
      }
      case StudentRole.OWNER: {
        return (
          <Chip size="sm" color="secondary" startContent={<StarIcon />}>
            Dueño
          </Chip>
        );
      }
      default:
        return null;
    }
  }

  return (
    <Card className="sm:min-w-max">
      <CardBody>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <NexusLogo />
              <div>
                <h2 className="text-slate-400">Documento Único Académico</h2>
                <p className="text-xs">Registro Nacional de Alumnos</p>
                <p className="text-xs font-semibold">NEXUS</p>
              </div>
            </div>
            {isStudentOnOverService(user) ? (
              <div className="flex flex-col gap-2 items-end">
                <p className="text-sm text-foreground-300">OverService</p>
                <div className="flex gap-2 items-center">
                  {parseStudentRole(user?.subscription?.role ?? null)}
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex gap-6 items-center">
            <div className="w-max">
              <Avatar
                src={user?.subscription?.profilePicture ?? undefined}
                name={`${user?.firstName[0]}${user?.lastName[0]}`}
                alt="Avatar"
                classNames={{
                  base: "w-24 h-24",
                }}
                radius="md"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="sm:flex gap-4 items-center">
                <p className="font-semibold">NOMBRE</p>
                <p className="text-sm uppercase">{user?.firstName ?? "..."}</p>
                <p className="font-semibold">APELLIDO</p>
                <p className="text-sm uppercase">{user?.lastName ?? "..."}</p>
              </div>
              <div className="sm:flex gap-4 items-center">
                <p className="font-semibold">LEGAJO ACADÉMICO</p>
                <p className="text-sm uppercase">{user?.academicId ?? "..."}</p>
              </div>
              <div className="sm:flex gap-4 items-center">
                <p className="font-semibold">DOCUMENTO</p>
                <p className="text-sm uppercase">{user?.dni ?? "..."}</p>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="sm:absolute sm:right-0 sm:bottom-0 sm:p-2">
              <h1 className="text-foreground-200 text-right text-2xl max-w-xl">
                {user?.career?.name}
              </h1>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
