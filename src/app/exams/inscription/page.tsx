import ExamInscriptionPanel from "@/app/components/Exams/Inscription/ExamInscriptionPanel";
import MainDashboard from "../../components/Dashboard/MainDashboard";

export default async function ExamInscription() {
  return (
    <MainDashboard>
      <ExamInscriptionPanel />
    </MainDashboard>
  );
}
