import { UserSession } from "@/lib/types/auth.types";
import Autogestion from "autogestion-frvm";
import type { ClientSection } from "autogestion-frvm/client";

export async function buildClient(user: UserSession): Promise<Autogestion> {
  const { academicId, hash } = user;

  const client = new Autogestion(`${academicId}`);

  // Try to login.
  await client.authenticate(hash);

  return client;
}

/**
 * Fetches available sections from the client.
 *
 * @param {string} academicId The academic id of the user.
 * @param {string} password The password of the user.
 */
export async function getSections(
  academicId: string,
  password: string
): Promise<Array<ClientSection>> {
  try {
    // Build the client.
    const client = new Autogestion(academicId, password);
    await client.authenticate();

    // Fetch the sections to display.
    const sections = await client.sections.fetchAll();

    return sections;
  } catch (e) {
    throw e;
  }
}
