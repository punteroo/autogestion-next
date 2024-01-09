import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "../auth/[...nextauth]/route";

const uploadthing = createUploadthing();

export const avatarUpload = {
  imageUploader: uploadthing({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }): Promise<any> => {
      // Validate the user has a valid session.
      const session = await auth();

      if (!session || !session?.user) throw new Error("Invalid session.");

      // Validate the user has a valid subscription.
      if (!session.user.subscription)
        throw new Error("You are not subscribed to OverServices.");
    })
    .onUploadComplete(async ({ file }) => {
      return file.url;
    }),
} satisfies FileRouter;

export type AvatarUpload = typeof avatarUpload;
