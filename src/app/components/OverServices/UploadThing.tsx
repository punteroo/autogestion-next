import type { AvatarUpload } from "@/app/api/uploadthing/core";
import { generateComponents } from "@uploadthing/react";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<AvatarUpload>();
