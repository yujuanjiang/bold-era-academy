export function lessonHref(
  courseId: string,
  lessonId: string,
  options: { retake?: boolean } = {}
) {
  const searchParams = new URLSearchParams({
    courseId,
    lessonId,
  });

  if (options.retake) {
    searchParams.set("retake", "1");
  }

  return `/learn?${searchParams.toString()}`;
}
