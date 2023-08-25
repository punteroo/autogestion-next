import MainDashboard from "../components/Dashboard/MainDashboard";
import SurveysPanel from "../components/Surveys/SurveysPanel";

export default async function Surveys() {
  return (
    <MainDashboard>
      <SurveysPanel />
    </MainDashboard>
  );
}
