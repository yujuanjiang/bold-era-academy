import { Suspense } from "react";

import { GenericLessonReader } from "@/components/academy/generic-lesson-reader";
import { AuthGate } from "@/components/auth/auth-gate";

export default function LearnPage() {
  return (
    <AuthGate>
      <Suspense fallback={null}>
        <GenericLessonReader />
      </Suspense>
    </AuthGate>
  );
}
