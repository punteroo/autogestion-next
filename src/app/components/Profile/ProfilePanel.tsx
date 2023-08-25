"use client";

import { Card, CardHeader, Divider, CardBody } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { UserSession } from "../../api/auth/[...nextauth]/route";

export default function ProfilePanel() {
  const { data: session } = useSession();
  const user = session?.user as UserSession;

  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <h1 className="my-4 text-xl font-bold">Mis Datos</h1>
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">
              {user.lastName}, {user.firstName}
            </p>
            <p className="text-small text-default-500">{user.career.name}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col">
            <p className="text-md">Legajo #{user.academicId}</p>
            <p className="text-small text-default-500">DNI {user.dni}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
