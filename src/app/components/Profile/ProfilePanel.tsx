"use client";

import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Button,
  Avatar,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { UserSession } from "../../api/auth/[...nextauth]/route";
import { LockIcon } from "../Icons/LockIcon";

export default function ProfilePanel() {
  const { data: session } = useSession();
  const user = session?.user as UserSession;

  return (
    <>
      <h1 className="hidden md:block text-3xl font-bold m-4 text-center">
        Mi Cuenta
      </h1>
      <div className="flex max-md:flex-col items-center md:items-start justify-center md:justify-between md:flex mx-4 gap-4">
        <h1 className="my-4 text-xl font-bold md:hidden">Mi Cuenta</h1>
        <Card className="w-full">
          {user ? (
            <>
              <CardHeader className="flex gap-3">
                <div className="flex gap-4 items-center">
                  <div className="hidden md:block">
                    <Avatar
                      isBordered
                      radius="full"
                      src="/avatar.jpg"
                      size="md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md">
                      {user?.lastName}, {user?.firstName}
                    </p>
                    <p className="text-small text-default-500">
                      {user?.career?.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-md">Legajo #{user?.academicId}</p>
                  <p className="text-small text-default-500">DNI {user?.dni}</p>
                </div>
              </CardBody>
            </>
          ) : null}
        </Card>

        <Card className="w-full">
          <CardHeader>
            <h1 className="font-bold text-base m-auto">Acciones</h1>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid auto-col-auto gap-x-2 gap-y-2 grid-flow-col">
              <div className="mx-auto">
                <Button color="danger" size="md" startContent={<LockIcon />}>
                  Cambiar Contraseña
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
