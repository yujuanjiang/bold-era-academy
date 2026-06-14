import { CourseCatalog } from "@/components/academy/course-catalog";
import { courses } from "@/lib/academy-data";

export default function CoursesPage() {
  return <CourseCatalog courses={courses} />;
}
