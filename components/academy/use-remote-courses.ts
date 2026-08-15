"use client";

import { useEffect, useMemo, useState } from "react";

import type { Course, LearningCard, Lesson } from "@/lib/academy-data";

const courseContentCacheKey = "bold-era-course-content-v1";
const defaultSiteUrl = "https://www.boldera.academy";

type CourseContentPayload = {
  schema_version: 1;
  updated_date?: string;
  courses: Course[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isLearningCard(value: unknown): value is LearningCard {
  return (
    isRecord(value) &&
    isString(value.title) &&
    isString(value.body) &&
    isString(value.takeaway)
  );
}

function isLesson(value: unknown): value is Lesson {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.summary) &&
    ["lesson", "quiz", "practice"].includes(String(value.kind)) &&
    ["complete", "current", "locked"].includes(String(value.status)) &&
    typeof value.xp === "number" &&
    (!("cards" in value) ||
      value.cards === undefined ||
      (Array.isArray(value.cards) && value.cards.every(isLearningCard)))
  );
}

function isCourse(value: unknown): value is Course {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.description) &&
    ["purple", "gold"].includes(String(value.tone)) &&
    ["brain", "message", "bot", "chart"].includes(String(value.icon)) &&
    Array.isArray(value.lessons) &&
    value.lessons.length > 0 &&
    value.lessons.every(isLesson)
  );
}

function isCourseContentPayload(value: unknown): value is CourseContentPayload {
  return (
    isRecord(value) &&
    value.schema_version === 1 &&
    Array.isArray(value.courses) &&
    value.courses.length > 0 &&
    value.courses.every(isCourse)
  );
}

function readCachedCourses() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cachedValue = window.localStorage.getItem(courseContentCacheKey);

    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue) as unknown;
    return isCourseContentPayload(payload) ? payload.courses : null;
  } catch {
    return null;
  }
}

function getRemoteCourseContentUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_COURSE_CONTENT_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  if (
    window.location.protocol.startsWith("http") &&
    ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname)
  ) {
    return "/course-content.json";
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;

  return `${siteUrl.replace(/\/$/, "")}/course-content.json`;
}

export function useRemoteCourses(fallbackCourses: Course[]) {
  return useRemoteCourseContent(fallbackCourses).courses;
}

export function useRemoteCourseContent(fallbackCourses: Course[]) {
  const [remoteCourses, setRemoteCourses] = useState<Course[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    window.setTimeout(() => {
      const cachedCourses = readCachedCourses();

      if (isMounted && cachedCourses) {
        setRemoteCourses(cachedCourses);
      }
    }, 0);

    async function loadCourses() {
      try {
        const response = await fetch(getRemoteCourseContentUrl(), {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Course content request failed: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;

        if (!isCourseContentPayload(payload)) {
          throw new Error("Course content JSON is not valid.");
        }

        window.localStorage.setItem(
          courseContentCacheKey,
          JSON.stringify(payload)
        );

        if (isMounted) {
          setRemoteCourses(payload.courses);
        }
      } catch (error) {
        console.warn("Using bundled course content.", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const courses = useMemo(
    () => (remoteCourses?.length ? remoteCourses : fallbackCourses),
    [fallbackCourses, remoteCourses]
  );

  return { courses, isLoading };
}
