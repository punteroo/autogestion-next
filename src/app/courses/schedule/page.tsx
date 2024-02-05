import CurrentCourseSchedule from "@/app/components/Courses/Schedule/CurrentCourseSchedule";
import MainDashboard from "@/app/components/Dashboard/MainDashboard";

export default function CourseSchedule() {
  return (
    <MainDashboard>
      <CurrentCourseSchedule />
    </MainDashboard>
  );
}
