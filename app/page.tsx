import { LearningDashboard } from "@/components/academy/learning-dashboard";
import { courses } from "@/lib/academy-data";

export default function Home() {
  return <LearningDashboard courses={courses} />;
}
