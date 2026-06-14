export type CourseTone = "purple" | "gold";
export type CourseIcon = "brain" | "message" | "bot" | "chart";
export type LessonKind = "lesson" | "quiz" | "practice";
export type LessonStatus = "complete" | "current" | "locked";

export type LearningCard = {
  title: string;
  body: string;
  takeaway: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  kind: LessonKind;
  status: LessonStatus;
  xp: number;
  cards?: LearningCard[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  tone: CourseTone;
  icon: CourseIcon;
  lessons: Lesson[];
};

export const currentLesson = {
  courseId: "ai-strategy-basics",
  lessonId: "what-is-an-ai-strategy",
};

export const courses: Course[] = [
  {
    id: "ai-foundations",
    title: "AI Foundations",
    description: "Understand core AI concepts and real-world applications.",
    tone: "purple",
    icon: "brain",
    lessons: [
      {
        id: "what-ai-can-do",
        title: "What AI Can Do",
        summary: "Learn where AI helps, where it struggles, and how to spot useful applications.",
        kind: "lesson",
        status: "complete",
        xp: 10,
      },
      {
        id: "models-and-tools",
        title: "Models, Tools, and Workflows",
        summary: "Understand the difference between AI models, products, and business workflows.",
        kind: "lesson",
        status: "complete",
        xp: 10,
      },
      {
        id: "ai-risk-basics",
        title: "AI Risk Basics",
        summary: "Recognize hallucinations, privacy risk, and quality-control habits.",
        kind: "quiz",
        status: "current",
        xp: 15,
      },
    ],
  },
  {
    id: "prompting-for-work",
    title: "Prompting for Work",
    description: "Write better prompts and get better results with AI.",
    tone: "gold",
    icon: "message",
    lessons: [
      {
        id: "prompt-structure",
        title: "Prompt Structure",
        summary: "Use role, context, task, constraints, and examples to get clearer outputs.",
        kind: "lesson",
        status: "current",
        xp: 10,
      },
      {
        id: "rewrite-with-ai",
        title: "Rewrite with AI",
        summary: "Practice turning rough notes into polished business communication.",
        kind: "practice",
        status: "locked",
        xp: 15,
      },
    ],
  },
  {
    id: "ai-agents-for-business",
    title: "AI Agents for Business",
    description: "Build and deploy AI agents that automate real work.",
    tone: "purple",
    icon: "bot",
    lessons: [
      {
        id: "agent-basics",
        title: "Agent Basics",
        summary: "Learn what makes an AI agent different from a normal chatbot.",
        kind: "lesson",
        status: "current",
        xp: 10,
      },
      {
        id: "agent-use-cases",
        title: "Agent Use Cases",
        summary: "Identify practical agent workflows for sales, operations, and support.",
        kind: "lesson",
        status: "locked",
        xp: 10,
      },
    ],
  },
  {
    id: "ai-strategy-basics",
    title: "AI Strategy Basics",
    description: "Choose valuable use cases and connect AI to business goals.",
    tone: "gold",
    icon: "chart",
    lessons: [
      {
        id: "ai-opportunity",
        title: "Find AI Opportunities",
        summary: "Map business pain points to realistic AI use cases.",
        kind: "lesson",
        status: "complete",
        xp: 10,
      },
      {
        id: "value-before-tools",
        title: "Value Before Tools",
        summary: "Avoid tool-first thinking and define the result you want first.",
        kind: "lesson",
        status: "complete",
        xp: 10,
      },
      {
        id: "what-is-an-ai-strategy",
        title: "What is an AI Strategy?",
        summary: "Learn how strategy connects business goals, data, tools, and measurable impact.",
        kind: "lesson",
        status: "current",
        xp: 10,
        cards: [
          {
            title: "Start with business value",
            body: "An AI strategy is a plan to identify high-impact opportunities, choose the right technologies, and create measurable business value.",
            takeaway: "Strategy starts with the business outcome, not the AI tool.",
          },
          {
            title: "Pick focused use cases",
            body: "The goal is not to use AI everywhere. The goal is to focus on useful workflows where better speed, quality, or insight can change the outcome.",
            takeaway: "A strong AI use case is specific, practical, and measurable.",
          },
          {
            title: "Align people, data, and tools",
            body: "Useful AI work connects the team, the workflow, the available data, and the right implementation path so the solution can actually be adopted.",
            takeaway: "Impact comes from alignment across the whole workflow.",
          },
        ],
      },
      {
        id: "choose-a-use-case",
        title: "Choose a Use Case",
        summary: "Rank opportunities by value, feasibility, and urgency.",
        kind: "quiz",
        status: "locked",
        xp: 15,
      },
    ],
  },
];

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getLesson(courseId: string, lessonId: string) {
  const course = getCourse(courseId);

  return {
    course,
    lesson: course?.lessons.find((item) => item.id === lessonId),
  };
}

export function getLessonCards(lesson: Lesson): LearningCard[] {
  return (
    lesson.cards ?? [
      {
        title: lesson.title,
        body: lesson.summary,
        takeaway: "Finish every card to complete the lesson.",
      },
    ]
  );
}
