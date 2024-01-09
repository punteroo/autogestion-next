import { createNextRouteHandler } from "uploadthing/next";

import { avatarUpload } from "./core";

export const { GET, POST } = createNextRouteHandler({
  router: avatarUpload,
});
