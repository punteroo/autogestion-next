import MainDashboard from "../components/Dashboard/MainDashboard";
import TakenExamsPanel from "../components/Exams/TakenExamsPanel";

export default async function Exams() {
  return (
    <MainDashboard>
      <TakenExamsPanel />
    </MainDashboard>
  );
}
