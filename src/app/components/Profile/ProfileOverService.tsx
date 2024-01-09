"use client";

import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { UploadButton } from "../OverServices/UploadThing";
import { useSession } from "next-auth/react";
import { updateStudentSubscription } from "@/lib/actions/student.actions";

export function ProfileOverService() {
  const { data: session, update } = useSession();

  async function handleUploadComplete(
    profilePictureUrl: string
  ): Promise<void> {
    if (!session?.user || !session) return;

    try {
      // Update the student's profile.
      await updateStudentSubscription(
        session.user.academicId,
        profilePictureUrl
      );

      // Send the session update.
      update({
        subscription: {
          ...session?.user?.subscription,
          profilePicture: profilePictureUrl,
        },
      });
    } catch (e) {
      console.error(e);
      alert(
        "Ocurrió un error al actualizar tu foto de perfil. Intenta de nuevo más tarde."
      );
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex gap-2 items-center mx-auto">
          <h1 className="font-bold text-base m-auto">OverService</h1>
          <Chip size="sm" color="secondary" variant="flat">
            BETA
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm text-white/80">
            ¡Bienvenido a OverService! Aquí podrás acceder a todos los servicios
            que te ofrece tu subscripción.
          </h4>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg text-white/20">Foto de Perfil</h2>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Obtain the uploaded file URL
                const [{ url }] = res;

                // Update the user profile
                handleUploadComplete(url);
              }}
              onUploadError={(e) => console.error(e)}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
