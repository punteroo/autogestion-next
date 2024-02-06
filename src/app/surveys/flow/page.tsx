import MainDashboard from "@/app/components/Dashboard/MainDashboard";
import MainSurveyFlow from "@/app/components/Surveys/Flow/MainSurveyFlow";
import { PollEntry } from "autogestion-frvm/types";
import Link from "next/link";
import { PollAnswerFlowProvider } from "@/app/context/PollAnswerContext";
import { buildClient } from "@/app/api/autogestion/client.wrapper";
import { auth } from "@/app/auth";

type SurveyFlowPageProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
};

export default async function SurveyFlow({
  searchParams,
}: SurveyFlowPageProps) {
  // Obtain flow information from the URL query.
  const { entry } = searchParams!;

  if (!entry) {
    return (
      <MainDashboard>
        <div className="flex flex-col gap-y-4 w-full px-4 text-center items-center">
          <h2 className="text-xl font-bold">No se ha encontrado la encuesta</h2>
          <p className="text-md font-semibold text-slate-800">
            Es posible que ya hayas respondido a esta encuesta o ya no este
            disponible.
          </p>
          <div className="py-2 px-4 rounded-full bg-slate-800 font-semibold w-min">
            <Link href="/surveys">Regresar</Link>
          </div>
        </div>
      </MainDashboard>
    );
  }

  function validatePollEntry(entry: string): PollEntry | null {
    try {
      // Decode the entry.
      const decodedEntry = Buffer.from(entry, "base64").toString("utf-8");

      // Validate the entry's content.
      const poll = JSON.parse(decodedEntry);

      for (const key of Object.keys(poll)) {
        const validKeys: Array<keyof PollEntry> = [
          "anioCursado",
          "persona",
          "encuestaRealizada",
          "cargoDocente",
        ];

        if (!validKeys.includes(key as keyof PollEntry)) {
          return null;
        }
      }

      return poll as PollEntry;
    } catch (e) {
      console.error(`Failed to validate poll entry flow: ${e}`);
      return null;
    }
  }

  // Validate the entry's content.
  const poll = validatePollEntry(entry!);

  if (!poll)
    return (
      <MainDashboard>
        <div className="flex flex-col gap-y-4 w-full px-4 text-center items-center">
          <h2 className="text-xl font-bold">¿Cómo llegaste hasta aquí?</h2>
          <p className="text-md font-semibold text-slate-800">
            No modifiques la URL de la encuesta, pillin.
          </p>
          <img src="https://cloudfront-us-east-1.images.arcpublishing.com/artear/34N33M5TINEGJG5A4DO53WQUDQ.jpg" />
          <div className="py-2 px-4 rounded-full bg-slate-800 font-semibold w-min">
            <Link href="/surveys">Regresar</Link>
          </div>
        </div>
      </MainDashboard>
    );

  // Search for the poll again to check if it's still available.
  const session = await auth();

  if (!session?.user)
    return (
      <MainDashboard>
        <div className="flex flex-col gap-y-4 w-full px-4 text-center items-center">
          <h2 className="text-xl font-bold">No se ha encontrado la encuesta</h2>
          <p className="text-md font-semibold text-slate-800">
            Es posible que ya hayas respondido a esta encuesta o ya no este
            disponible.
          </p>
          <div className="py-2 px-4 rounded-full bg-slate-800 font-semibold w-min">
            <Link href="/surveys">Regresar</Link>
          </div>
        </div>
      </MainDashboard>
    );

  const client = await buildClient(session?.user);

  const polls = await client.polling.available.fetch();

  const serverPoll = polls.find(
    (p) => poll.cargoDocente.id === p.cargoDocente.id
  );

  if (serverPoll && serverPoll.encuestaRealizada)
    return (
      <MainDashboard>
        <div className="flex flex-col gap-y-4 w-full px-4 text-center items-center">
          <h2 className="text-xl font-bold">
            Esta encuesta ya fue respondida.
          </h2>
          <p className="text-md font-semibold text-slate-800">
            Ya has respondido a esta encuesta.
          </p>
          <div className="py-2 px-4 rounded-full bg-slate-800 font-semibold w-min">
            <Link href="/surveys">Regresar</Link>
          </div>
        </div>
      </MainDashboard>
    );

  return (
    <MainDashboard>
      <PollAnswerFlowProvider poll={poll}>
        <MainSurveyFlow />
      </PollAnswerFlowProvider>
    </MainDashboard>
  );
}
