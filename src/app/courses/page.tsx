import AcademicStatusPanel from "../components/Courses/Academic/AcademicStatusPanel";
import MainDashboard from "../components/Dashboard/MainDashboard";

export default async function AcademicStatus() {
    return (
        <MainDashboard>
            <AcademicStatusPanel />
        </MainDashboard>
    )
}