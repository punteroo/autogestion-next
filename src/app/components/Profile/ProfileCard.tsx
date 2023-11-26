"use client";

import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { NexusLogo } from "../Icons/NexusLogo";

type ProfileCardProps = {
  user: UserSession;
};

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="w-full md:w-[850px]">
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
              <Image className="w-full" isBlurred src="/avatar.jpg" alt="Profile Picture" />
            </div>
            <div className="flex flex-col w-full">
              <div>
                <p className="font-semibold">NOMBRE</p>
                <p className="text-sm uppercase">{user?.firstName ?? "..."}</p>
                <p className="font-semibold">APELLIDO</p>
                <p className="text-sm uppercase">{user?.lastName ?? "..."}</p>
                <p className="font-semibold">LEGAJO ACADÉMICO</p>
                <p className="text-sm uppercase">{user?.academicId ?? "..."}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold">DOCUMENTO</p>
            <p className="text-sm uppercase">{user?.dni ?? "..."}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
