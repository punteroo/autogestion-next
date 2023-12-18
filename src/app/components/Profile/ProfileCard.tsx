"use client";

import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { NexusLogo } from "../Icons/NexusLogo";

type ProfileCardProps = {
  user: UserSession;
};

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="sm:min-w-max">
      <CardBody>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <NexusLogo />
            <div>
              <h2 className="text-slate-400">Documento Único Académico</h2>
              <p className="text-xs">Registro Nacional de Alumnos</p>
              <p className="text-xs font-semibold">NEXUS</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-max">
              <Image
                className="w-full"
                isBlurred
                src="/avatar.jpg"
                alt="Profile Picture"
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
          <div className="sm:absolute sm:right-0 sm:bottom-0 sm:p-2">
            <h1 className="text-foreground-200 text-right text-2xl max-w-xl">
              {user?.career?.name}
            </h1>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
