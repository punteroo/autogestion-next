"use client";

import { Card, CardHeader, Divider, CardBody, Button } from "@nextui-org/react";
import { LockIcon } from "../Icons/LockIcon";
import { StarIcon } from "../Icons/StarIcon";
import { OverServiceCard } from "./OverService/OverServiceCard";
import { useSession } from "next-auth/react";
import { isStudentOnOverService } from "@/lib/subscription.utils";

export function ProfileActions() {
  const { data: session } = useSession();

  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="font-bold text-base m-auto">Acciones</h1>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col justify-between items-center gap-4">
          <div className="mx-auto">
            <div className="flex max-xl:flex-col gap-4">
              <Button color="danger" size="md" startContent={<LockIcon />}>
                Cambiar Contraseña
              </Button>
              <Button color="primary" size="md" startContent={<StarIcon />}>
                Coming Soon
              </Button>
            </div>
          </div>
          {isStudentOnOverService(session?.user) ? null : <OverServiceCard />}
        </div>
      </CardBody>
    </Card>
  );
}
