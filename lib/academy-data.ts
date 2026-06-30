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
  courseId: "ai-for-everyone",
  lessonId: "core-concepts",
};

export const courses: Course[] = [
  // ── 1. AI for Everyone ──────────────────────────────────────────────────────
  {
    id: "ai-for-everyone",
    title: "AI for Everyone",
    description: "A friendly introduction to AI for people with no technical background.",
    tone: "purple",
    icon: "brain",
    lessons: [
      {
        id: "core-concepts",
        title: "Core Concepts",
        summary: "Understand what AI is, how it works, and where you already use it every day.",
        kind: "lesson",
        status: "current",
        xp: 10,
        cards: [
          {
            title: "Does AI actually understand what I say?",
            body: "AI does not understand like a person. It finds patterns in language, images, or data and predicts a useful response based on what it has learned.",
            takeaway: "AI predicts — it does not understand.",
          },
          {
            title: "Why does AI sometimes sound so confident?",
            body: "AI is designed to produce fluent answers, not to feel certainty. It may sound confident even when it is wrong, so important answers should be checked.",
            takeaway: "Fluency is not accuracy — always verify important answers.",
          },
          {
            title: "What makes today's AI different from older software?",
            body: "Older software follows exact rules written by humans. Modern AI learns patterns from examples, so it can handle flexible tasks like writing, summarizing, and recognizing images.",
            takeaway: "Modern AI learns from examples, not just rules.",
          },
          {
            title: "Where do I already use AI every day?",
            body: "You likely use AI in maps, search engines, shopping recommendations, spam filters, voice assistants, translation tools, and photo apps. Much of it works quietly in the background.",
            takeaway: "AI is already woven into your daily tools.",
          },
          {
            title: "What is a prompt?",
            body: "A prompt is the instruction or question you give to an AI tool. Clear prompts usually produce clearer answers because they give the AI better direction.",
            takeaway: "Clear prompts lead to clearer answers.",
          },
          {
            title: "What is a good first AI habit?",
            body: "Ask AI to explain its reasoning, list assumptions, or show alternatives. This turns AI from an answer machine into a thinking partner.",
            takeaway: "Ask for reasoning, not just answers.",
          },
        ],
      },
      {
        id: "common-questions",
        title: "Common Questions",
        summary: "Get honest answers to the questions most people have when starting with AI.",
        kind: "lesson",
        status: "locked",
        xp: 10,
        cards: [
          {
            title: "Can AI replace my own judgment?",
            body: "AI can support your thinking, but it should not replace your judgment. Use it to explore ideas, compare options, and draft work, then decide what makes sense.",
            takeaway: "AI supports judgment — it does not replace it.",
          },
          {
            title: "Is it safe to share personal information with AI?",
            body: "Avoid sharing passwords, private financial details, medical records, or sensitive personal information unless you fully trust the tool and understand its privacy rules.",
            takeaway: "Protect sensitive information — read the privacy rules first.",
          },
          {
            title: "Why does AI give different answers sometimes?",
            body: "AI can respond differently because it generates answers instead of retrieving one fixed response. Small changes in wording can lead to different wording, emphasis, or suggestions.",
            takeaway: "AI generates — small changes in input change the output.",
          },
          {
            title: "Can AI help me learn faster?",
            body: "Yes, AI can explain topics, quiz you, simplify text, and create examples. It works best when you ask follow-up questions and check important facts.",
            takeaway: "AI accelerates learning when you stay curious and verify.",
          },
          {
            title: "Do I need technical skills to use AI?",
            body: "No, many AI tools are built for everyday language. You can start by asking for summaries, explanations, drafts, plans, or comparisons.",
            takeaway: "Plain language is enough to get started.",
          },
          {
            title: "What should I try first with AI?",
            body: "Start with a low-risk task like summarizing an article, rewriting an email, planning a trip, or explaining a confusing term. Practice matters more than perfect prompts.",
            takeaway: "Start small — practice builds skill faster than theory.",
          },
        ],
      },
      {
        id: "analogies-and-myths",
        title: "Analogies & Myths",
        summary: "Use everyday comparisons to understand AI — and clear up the most common misconceptions.",
        kind: "quiz",
        status: "locked",
        xp: 15,
        cards: [
          {
            title: "How should I think about AI assistants?",
            body: "Think of an AI assistant as a helpful first draft partner. It can get you started, but you still review, edit, and decide. It is like a GPS: useful for directions, but you still watch the road.",
            takeaway: "AI is a starting point — you still drive.",
          },
          {
            title: "Why does AI need clear instructions?",
            body: "AI performs better when you explain the goal, audience, and format. Vague requests often lead to vague results. It is like ordering food: the clearer your order, the closer the result matches what you wanted.",
            takeaway: "Clarity in — clarity out.",
          },
          {
            title: "How can AI be useful but imperfect?",
            body: "AI can save time and suggest useful ideas, but it can also miss context or make mistakes. It is like a calculator with a sticky key: powerful, but you still check the result.",
            takeaway: "Useful does not mean flawless.",
          },
          {
            title: "Is AI always objective?",
            body: "No, AI can reflect patterns, gaps, or bias in the data used to train it. A polished answer is not automatically fair or complete.",
            takeaway: "Polish is not the same as objectivity.",
          },
          {
            title: "Does AI know the truth automatically?",
            body: "No, AI predicts likely answers and may be outdated or mistaken. For important topics, compare with trusted sources.",
            takeaway: "Verify before trusting — especially on important topics.",
          },
        ],
      },
    ],
  },

  // ── 2. AI for Entrepreneurs and Business Owners ─────────────────────────────
  {
    id: "ai-for-entrepreneurs",
    title: "AI for Entrepreneurs",
    description: "Use AI to save time, improve operations, and grow your business.",
    tone: "gold",
    icon: "chart",
    lessons: [
      {
        id: "business-foundations",
        title: "Business Foundations",
        summary: "Understand where AI creates real value and how to choose the right place to start.",
        kind: "lesson",
        status: "current",
        xp: 10,
        cards: [
          {
            title: "Where can AI save a business time first?",
            body: "AI often helps fastest with repetitive writing, customer replies, meeting summaries, research, data cleanup, and simple planning. Start where work is frequent and time-consuming.",
            takeaway: "Start with frequent, time-consuming, and repeatable tasks.",
          },
          {
            title: "What is an AI use case?",
            body: "An AI use case is a specific business task where AI can create value. Good use cases have a clear problem, user, workflow, and measurable benefit.",
            takeaway: "A good use case is specific and measurable.",
          },
          {
            title: "How should a business choose an AI tool?",
            body: "Choose based on the job you need done, not the hype. Look at accuracy, privacy, ease of use, integrations, cost, and how well it fits your workflow.",
            takeaway: "Match the tool to the job — ignore the hype.",
          },
          {
            title: "What does AI automation mean?",
            body: "AI automation means using AI to complete or assist repeatable tasks with less manual effort. It works best when the task has clear inputs, steps, and review points.",
            takeaway: "Automation works best with clear inputs and review points.",
          },
          {
            title: "Why should businesses start small with AI?",
            body: "Small pilots reduce risk and reveal what actually works. A focused experiment is easier to measure, improve, and scale than a broad AI transformation project.",
            takeaway: "Small pilots teach more than big plans.",
          },
          {
            title: "What is an AI policy?",
            body: "An AI policy is a simple guide for how people in your business may use AI. It should explain approved tools, data rules, review steps, and accountability.",
            takeaway: "Simple rules protect your business and build trust.",
          },
        ],
      },
      {
        id: "business-faqs",
        title: "Business FAQs",
        summary: "Practical answers to the questions business owners ask most about AI.",
        kind: "lesson",
        status: "locked",
        xp: 10,
        cards: [
          {
            title: "Do I need a technical team to start?",
            body: "No, many useful AI projects can begin with existing tools. You may need technical help later for custom integrations, security, or complex automation.",
            takeaway: "Start with tools you have — technical help comes later.",
          },
          {
            title: "How do I measure AI's business value?",
            body: "Track practical outcomes like hours saved, faster response time, more leads, fewer errors, better customer satisfaction, or lower operating cost. Measure before and after the pilot.",
            takeaway: "Measure before and after — outcomes prove value.",
          },
          {
            title: "Can AI improve customer service?",
            body: "Yes, AI can draft replies, summarize customer history, answer common questions, and route requests. Keep human review for sensitive, emotional, or high-value customer situations.",
            takeaway: "AI handles volume — humans handle sensitivity.",
          },
          {
            title: "What business data should I protect?",
            body: "Protect customer information, contracts, financial records, employee details, trade secrets, and unreleased plans. Do not paste sensitive data into tools without approved privacy controls.",
            takeaway: "Sensitive data needs approved tools and clear rules.",
          },
          {
            title: "How can managers encourage responsible AI use?",
            body: "Set simple rules for approved tools, sensitive data, review requirements, and acceptable use. Encourage experimentation while making accountability clear.",
            takeaway: "Clear rules enable safe experimentation.",
          },
          {
            title: "What is the best first AI project?",
            body: "Pick a task that is frequent, low-risk, easy to review, and clearly annoying today. Examples include email drafts, sales notes, FAQs, reports, or meeting summaries.",
            takeaway: "Pick the task that annoys you most and is easy to review.",
          },
        ],
      },
      {
        id: "business-analogies",
        title: "Analogies & Myths",
        summary: "See through AI hype and understand what actually makes it work in business.",
        kind: "quiz",
        status: "locked",
        xp: 15,
        cards: [
          {
            title: "How should I view AI in my company?",
            body: "AI is not magic strategy by itself. It is a tool that becomes valuable when connected to real customer, cost, or growth problems. It is like hiring an intern with endless energy: useful with clear tasks, risky without supervision.",
            takeaway: "AI needs direction — it is not a strategy on its own.",
          },
          {
            title: "Why does AI need a workflow?",
            body: "AI output is only useful if someone knows where it goes next. A workflow turns a clever response into actual business progress. It is like a kitchen: ingredients matter, but the recipe and handoff make the meal.",
            takeaway: "A response without a workflow is wasted.",
          },
          {
            title: "How do AI pilots help reduce risk?",
            body: "A pilot lets you test AI on a small part of the business before expanding. You learn what works without disrupting everything. It is like opening a pop-up shop before signing a long lease.",
            takeaway: "Test small before you commit.",
          },
          {
            title: "Will AI fix a broken process?",
            body: "AI usually amplifies the process you already have. If the workflow is confusing, AI may make mistakes faster instead of solving the root problem.",
            takeaway: "Fix the process before automating it.",
          },
          {
            title: "Is every business task good for AI?",
            body: "No, AI is not ideal for every task. It is weaker when accuracy, legal responsibility, emotional judgment, or private data handling require careful human control.",
            takeaway: "Not every task belongs to AI — choose deliberately.",
          },
        ],
      },
    ],
  },

  // ── 3. Step-By-Step: Build Your First AI Agent in 5 Minutes ────────────────
  {
    id: "build-ai-agent",
    title: "Build Your First AI Agent",
    description: "Step-by-step: understand and build a simple AI agent in 5 minutes.",
    tone: "purple",
    icon: "bot",
    lessons: [
      {
        id: "agent-concepts",
        title: "Agent Concepts",
        summary: "Learn what an AI agent is, what it needs, and how it differs from a chatbot.",
        kind: "lesson",
        status: "current",
        xp: 10,
        cards: [
          {
            title: "What makes an AI agent different?",
            body: "An AI agent can follow a goal, use tools, and take steps toward an outcome. A normal chatbot mostly responds to one message at a time.",
            takeaway: "Agents pursue goals — chatbots respond to messages.",
          },
          {
            title: "What are the basic parts of an agent?",
            body: "A simple agent needs a goal, instructions, a model, tools, and a way to return results. More advanced agents may also use memory and safety checks.",
            takeaway: "Goal + instructions + model + tools = agent.",
          },
          {
            title: "What is an agent goal?",
            body: "An agent goal tells the agent what outcome to work toward. A good goal is specific enough to guide action and simple enough to evaluate.",
            takeaway: "Specific goals produce predictable agents.",
          },
          {
            title: "Why do agents need tools?",
            body: "Tools let an agent do things beyond writing text, such as searching, reading files, calling apps, or calculating. Without tools, the agent mainly generates responses.",
            takeaway: "Tools turn responses into actions.",
          },
          {
            title: "What is the simplest useful agent?",
            body: "A simple useful agent handles one clear task, such as summarizing notes, drafting replies, or organizing research. Starting narrow makes it easier to trust and improve.",
            takeaway: "Narrow agents are easier to trust and improve.",
          },
          {
            title: "What should I test before trusting an agent?",
            body: "Test normal cases, messy cases, and cases where it should refuse or ask for help. Good agents handle limits as well as successes.",
            takeaway: "Test the edges, not just the easy cases.",
          },
        ],
      },
      {
        id: "agent-faqs",
        title: "Building Your Agent",
        summary: "Practical answers to get your first agent running safely and correctly.",
        kind: "lesson",
        status: "locked",
        xp: 10,
        cards: [
          {
            title: "Can I build an agent without coding?",
            body: "Yes, many platforms offer no-code or low-code agent builders. You still need to define the goal, instructions, inputs, outputs, and review steps clearly.",
            takeaway: "No code needed — but clear instructions are essential.",
          },
          {
            title: "What should my first agent do?",
            body: "Choose a low-risk task with a clear result, like turning meeting notes into action items. Avoid tasks involving private data, money movement, or legal decisions first.",
            takeaway: "Start low-risk with a clear, reviewable output.",
          },
          {
            title: "How do I know if my agent works?",
            body: "Test it with a few realistic examples and compare results to what you expected. Look for accuracy, completeness, tone, and whether it follows instructions.",
            takeaway: "Test with real examples — not just ideal ones.",
          },
          {
            title: "Should my first agent act automatically?",
            body: "For beginners, keep a human approval step before the agent sends, deletes, buys, or changes anything important. Automation should grow after trust is earned.",
            takeaway: "Earn trust before removing human review.",
          },
          {
            title: "What instructions should I give an agent?",
            body: "Tell it its role, goal, audience, limits, output format, and when to ask for help. Clear boundaries make agent behavior more predictable.",
            takeaway: "Define role, goal, limits, and format upfront.",
          },
        ],
      },
      {
        id: "agent-analogies",
        title: "Analogies & Myths",
        summary: "Clear up common misunderstandings about what AI agents can and cannot do.",
        kind: "quiz",
        status: "locked",
        xp: 15,
        cards: [
          {
            title: "How is an agent like an assistant?",
            body: "An agent can take a goal and work through steps instead of only answering one question. It still needs supervision, especially at first. It is like a new assistant who can work quickly but needs a clear brief and review.",
            takeaway: "Capable but supervised — especially at the start.",
          },
          {
            title: "Why should my agent start with one task?",
            body: "A narrow task is easier to test and improve. Broad agents are harder to control because success is unclear. It is like teaching someone one recipe before asking them to run the whole restaurant.",
            takeaway: "One task first — then expand.",
          },
          {
            title: "What are tools in an agent?",
            body: "Tools give the agent specific abilities it would not have from language alone. They turn advice into action. It is like giving a worker a phone, calendar, calculator, and filing cabinet.",
            takeaway: "Tools are what give agents real-world reach.",
          },
          {
            title: "Is an agent always autonomous?",
            body: "No, many useful agents are partially supervised. For beginners, the safest agents suggest actions and wait for human approval.",
            takeaway: "Supervised agents are safer and still very useful.",
          },
          {
            title: "Does a smarter model guarantee a better agent?",
            body: "No, the model is only one part. Good instructions, useful tools, testing, and safety boundaries often matter just as much.",
            takeaway: "Instructions and tools matter as much as the model.",
          },
        ],
      },
    ],
  },

  // ── 4. Step-By-Step: Create Your First AI Skill in 5 Minutes ───────────────
  {
    id: "create-ai-skill",
    title: "Create Your First AI Skill",
    description: "Step-by-step: build a reusable AI skill for any repeated task in 5 minutes.",
    tone: "gold",
    icon: "message",
    lessons: [
      {
        id: "skill-concepts",
        title: "Skill Concepts",
        summary: "Understand what an AI skill is and why reusable instructions save time.",
        kind: "lesson",
        status: "current",
        xp: 10,
        cards: [
          {
            title: "What is an AI skill?",
            body: "An AI skill is a reusable set of instructions for doing a specific task well. It helps AI repeat a workflow consistently instead of being re-explained each time.",
            takeaway: "A skill is a reusable instruction set for a repeated task.",
          },
          {
            title: "How is a skill different from a prompt?",
            body: "A prompt is usually a one-time instruction. A skill is packaged guidance that can be reused whenever the same type of task appears.",
            takeaway: "Prompts are one-off — skills are reusable.",
          },
          {
            title: "What should my first skill do?",
            body: "Your first skill should solve one repeated task, such as rewriting emails, summarizing calls, creating reports, or formatting notes. Keep it specific and easy to test.",
            takeaway: "One repeated task, specific and testable.",
          },
          {
            title: "What goes inside a useful skill?",
            body: "A useful skill includes purpose, steps, style preferences, output format, examples, and limits. These details help the AI produce consistent results.",
            takeaway: "Purpose + steps + format + examples = useful skill.",
          },
          {
            title: "Why do skills improve consistency?",
            body: "Skills reduce the need to remember every instruction each time. They give the AI a stable way to approach the same task repeatedly.",
            takeaway: "Skills create reliable, repeatable AI behavior.",
          },
          {
            title: "What is the easiest skill template?",
            body: "Use a simple structure: purpose, when to use it, steps to follow, output format, examples, and what to avoid. That is enough for many beginner skills.",
            takeaway: "Purpose, steps, format, examples, limits — that is your template.",
          },
        ],
      },
      {
        id: "skill-faqs",
        title: "Building Your Skill",
        summary: "Practical answers for writing, testing, and improving your first skill.",
        kind: "lesson",
        status: "locked",
        xp: 10,
        cards: [
          {
            title: "Do I need to code a skill?",
            body: "Not always. Many skills can start as plain-language instructions, examples, and a clear workflow, especially for writing, analysis, or formatting tasks.",
            takeaway: "Plain language is enough to start.",
          },
          {
            title: "How do I test my first skill?",
            body: "Run the skill on three real examples and check whether the output matches your expectations. Then adjust instructions where the result was unclear or inconsistent.",
            takeaway: "Three real examples reveal what to fix.",
          },
          {
            title: "Can one skill handle many tasks?",
            body: "It can, but beginners should avoid making one skill too broad. Smaller skills are easier to understand, test, reuse, and improve.",
            takeaway: "Narrow skills are easier to trust and improve.",
          },
          {
            title: "What makes a skill reusable?",
            body: "A skill is reusable when it describes a repeatable process, not just one situation. It should work across similar inputs without rewriting the instructions.",
            takeaway: "Describe the process, not just the situation.",
          },
          {
            title: "When should I update a skill?",
            body: "Update a skill when outputs are inconsistent, your workflow changes, or users keep correcting the same issue. Skills should improve through real use.",
            takeaway: "Real use reveals what needs updating.",
          },
        ],
      },
      {
        id: "skill-analogies",
        title: "Analogies & Myths",
        summary: "Use clear comparisons to understand skills — and avoid common mistakes.",
        kind: "quiz",
        status: "locked",
        xp: 15,
        cards: [
          {
            title: "How should I think about a skill?",
            body: "A skill teaches AI your preferred way to complete a task. It turns repeated instructions into a reusable pattern. It is like saving a recipe so you do not explain the dish from scratch every time.",
            takeaway: "Save the recipe — don't explain it every time.",
          },
          {
            title: "Why should a skill have examples?",
            body: "Examples show the AI what good output looks like. They reduce confusion when instructions could be interpreted in different ways. It is like showing a tailor a sample shirt instead of only describing the fit.",
            takeaway: "Show what good looks like — don't just describe it.",
          },
          {
            title: "Why keep a skill focused?",
            body: "Focused skills are easier for AI to follow and for you to evaluate. Too many goals can make the output messy. It is like labeling one drawer for one category instead of stuffing everything inside.",
            takeaway: "One drawer, one category — one skill, one job.",
          },
          {
            title: "Is a skill the same as automation?",
            body: "No, a skill describes how AI should perform a task. Automation connects that task to triggers, apps, or workflows that run it.",
            takeaway: "Skills define the how — automation handles the when.",
          },
          {
            title: "Will a skill work perfectly forever?",
            body: "No, skills need review as tools, workflows, and expectations change. Treat them as living instructions, not finished documents.",
            takeaway: "Skills are living documents — update them as you grow.",
          },
        ],
      },
    ],
  },

  // ── 5. AI for Professionals ─────────────────────────────────────────────────
  {
    id: "ai-for-professionals",
    title: "AI for Professionals",
    description: "Use AI to work smarter, communicate better, and automate the routine.",
    tone: "purple",
    icon: "brain",
    lessons: [
      {
        id: "professional-foundations",
        title: "Professional Foundations",
        summary: "Learn where AI fits in professional work and how to use it without losing your voice.",
        kind: "lesson",
        status: "current",
        xp: 10,
        cards: [
          {
            title: "Where can professionals use AI immediately?",
            body: "AI can help with emails, summaries, research, meeting notes, reports, brainstorming, spreadsheets, presentations, and planning. Start with tasks you repeat every week.",
            takeaway: "Start with your most repeated weekly tasks.",
          },
          {
            title: "What makes a prompt useful at work?",
            body: "A useful prompt includes context, goal, audience, tone, format, and constraints. The more clearly you define the job, the better the result usually becomes.",
            takeaway: "Context + goal + format = a useful work prompt.",
          },
          {
            title: "How can AI improve writing?",
            body: "AI can draft, rewrite, shorten, clarify, change tone, and create outlines. You should still review for accuracy, voice, and workplace sensitivity.",
            takeaway: "AI handles structure — you handle accuracy and voice.",
          },
          {
            title: "How can AI support better meetings?",
            body: "AI can turn notes into summaries, decisions, risks, and action items. It can also help prepare agendas and follow-up messages.",
            takeaway: "AI turns messy notes into clean action.",
          },
          {
            title: "What is workflow thinking with AI?",
            body: "Workflow thinking means placing AI inside a real work process, not using it as a random chatbot. This helps turn outputs into finished work.",
            takeaway: "Embed AI in the workflow — don't treat it as a chatbot.",
          },
          {
            title: "What is a personal AI playbook?",
            body: "A personal AI playbook is a short list of prompts and workflows you reuse. It helps you save time consistently instead of starting from zero.",
            takeaway: "Save your best prompts — reuse them every week.",
          },
        ],
      },
      {
        id: "professional-faqs",
        title: "Professional FAQs",
        summary: "Answers to the questions professionals ask most about using AI responsibly at work.",
        kind: "lesson",
        status: "locked",
        xp: 10,
        cards: [
          {
            title: "Can AI write my emails for me?",
            body: "AI can draft emails, but you should check tone, facts, names, and intent. The best results still sound like you and match the situation.",
            takeaway: "AI drafts — you review, personalize, and send.",
          },
          {
            title: "How do I avoid generic AI output?",
            body: "Give AI specific context, examples, audience details, and your preferred tone. Ask it to revise toward a clearer goal instead of accepting the first answer.",
            takeaway: "Specific input produces specific output.",
          },
          {
            title: "Can I use AI with confidential work?",
            body: "Only use approved tools and follow your organization's data rules. Avoid pasting confidential documents, customer data, or internal strategy into unapproved AI systems.",
            takeaway: "Approved tools only — know your organization's rules.",
          },
          {
            title: "How can managers use AI responsibly?",
            body: "Managers can use AI for planning, summarizing, communication, and analysis while keeping human judgment in decisions about people, performance, and sensitive issues.",
            takeaway: "AI supports analysis — humans own people decisions.",
          },
          {
            title: "Will AI make my work less personal?",
            body: "It can if you use raw outputs without editing. Use AI to handle structure and first drafts, then add judgment, context, and your own voice.",
            takeaway: "Add your voice after the AI draft.",
          },
          {
            title: "What should I automate first?",
            body: "Automate low-risk tasks that are repetitive, time-consuming, and easy to review. Good examples include summaries, formatting, status updates, and draft outlines.",
            takeaway: "Repetitive, low-risk, easy to review — automate those first.",
          },
        ],
      },
      {
        id: "professional-analogies",
        title: "Analogies & Myths",
        summary: "Reframe how you think about AI at work — and clear up what it cannot do.",
        kind: "quiz",
        status: "locked",
        xp: 15,
        cards: [
          {
            title: "How should I treat AI at work?",
            body: "Treat AI as a capable assistant, not a replacement for responsibility. It can speed up preparation, but you own the final result. It is like a junior colleague who drafts quickly but still needs your review.",
            takeaway: "You own the result — AI helps you prepare it.",
          },
          {
            title: "Why does AI need context?",
            body: "Without context, AI guesses what matters. With context, it can tailor the answer to your audience, goal, and situation. It is like asking for directions without saying where you are starting from.",
            takeaway: "No context means guesswork — give AI what it needs.",
          },
          {
            title: "How can AI reduce busywork?",
            body: "AI can handle first drafts and repetitive transformations, giving you more time for judgment and relationships. It is like a dishwasher: it saves labor, but you still decide what goes on the table.",
            takeaway: "AI handles the labor — you focus on the judgment.",
          },
          {
            title: "Does using AI mean I am cheating?",
            body: "Not when it is allowed, transparent when needed, and reviewed carefully. It is similar to using spellcheck, templates, or research tools responsibly.",
            takeaway: "Responsible use of tools is professional, not cheating.",
          },
          {
            title: "Can AI handle workplace nuance alone?",
            body: "No, AI can miss politics, emotions, history, and hidden context. Use it for support, but keep human judgment for delicate situations.",
            takeaway: "Nuance is yours — AI handles the structure.",
          },
        ],
      },
    ],
  },

  // ── 6. AI for Finance and Investing ─────────────────────────────────────────
  {
    id: "ai-for-finance",
    title: "AI for Finance and Investing",
    description: "How AI is used in financial analysis, investment research, and risk management.",
    tone: "gold",
    icon: "chart",
    lessons: [
      {
        id: "finance-foundations",
        title: "Finance Foundations",
        summary: "Understand where AI fits in finance today and why data quality is everything.",
        kind: "lesson",
        status: "current",
        xp: 10,
        cards: [
          {
            title: "How is AI used in finance today?",
            body: "AI helps with research, document review, fraud detection, forecasting, customer support, risk monitoring, and portfolio analysis. It supports professionals but does not remove uncertainty.",
            takeaway: "AI supports — it does not remove financial uncertainty.",
          },
          {
            title: "What can AI do for investment research?",
            body: "AI can summarize reports, compare companies, extract key risks, scan news, and organize financial information. Human review is essential before making decisions.",
            takeaway: "AI speeds research — humans make the decisions.",
          },
          {
            title: "Why is data quality critical in finance AI?",
            body: "Financial AI depends on accurate, timely, and relevant data. Bad data can lead to misleading analysis, poor signals, and overconfident decisions.",
            takeaway: "Bad data in — bad decisions out.",
          },
          {
            title: "What is AI risk assessment?",
            body: "AI risk assessment uses models to identify patterns that may signal financial, credit, market, fraud, or operational risk. It should complement expert judgment.",
            takeaway: "AI spots patterns — experts interpret them.",
          },
          {
            title: "What is AI washing?",
            body: "AI washing happens when a company exaggerates or misrepresents its use of AI. Investors should look for evidence, not just impressive claims.",
            takeaway: "Demand evidence — not just impressive claims.",
          },
          {
            title: "What is responsible AI use in finance?",
            body: "Responsible use means checking outputs, protecting private data, understanding model limits, documenting decisions, and keeping humans accountable for high-stakes choices.",
            takeaway: "Accountability stays with humans — always.",
          },
        ],
      },
      {
        id: "finance-faqs",
        title: "Investor FAQs",
        summary: "Honest answers to what AI can and cannot do for investors and analysts.",
        kind: "lesson",
        status: "locked",
        xp: 10,
        cards: [
          {
            title: "Can AI predict the stock market?",
            body: "AI can find patterns and generate scenarios, but it cannot reliably predict markets with certainty. Markets are affected by human behavior, news, policy, and unexpected events.",
            takeaway: "Patterns yes — predictions no.",
          },
          {
            title: "Should investors trust AI recommendations?",
            body: "Investors should treat AI recommendations as inputs, not instructions. Check assumptions, data sources, risk, fees, time horizon, and whether the advice fits your goals.",
            takeaway: "Inputs to consider — not instructions to follow.",
          },
          {
            title: "How can analysts use AI safely?",
            body: "Analysts can use AI to speed research, summarize filings, and generate questions. They should verify numbers, cite sources, and avoid relying on unsupported claims.",
            takeaway: "Verify every number — especially AI-generated ones.",
          },
          {
            title: "Can AI help detect fraud?",
            body: "Yes, AI can spot unusual patterns, suspicious transactions, or inconsistent claims. It should trigger investigation rather than automatically prove fraud.",
            takeaway: "AI flags — humans investigate.",
          },
          {
            title: "What should investors ask about AI companies?",
            body: "Ask what AI does, what data it uses, how results are measured, what risks exist, and whether claims are supported by real products or revenue.",
            takeaway: "Ask for evidence — products, data, and measured results.",
          },
          {
            title: "What is a safe first finance AI task?",
            body: "Start with summarizing public filings, organizing research notes, or creating questions for deeper analysis. Avoid using AI alone for trades or personal financial advice.",
            takeaway: "Summaries and research first — not trades or advice.",
          },
        ],
      },
      {
        id: "finance-analogies",
        title: "Analogies & Myths",
        summary: "See through AI hype in finance and understand its real role in investing.",
        kind: "quiz",
        status: "locked",
        xp: 15,
        cards: [
          {
            title: "How should AI fit into investing?",
            body: "AI should help gather and organize information, but final decisions need human goals, risk tolerance, and judgment. Faster analysis is not the same as wisdom. It is like a powerful research assistant, not a crystal ball.",
            takeaway: "Faster analysis is not wisdom.",
          },
          {
            title: "Why can AI miss financial risk?",
            body: "AI may focus on visible patterns while missing context, incentives, or unusual events. Risk often hides outside the data. It is like checking the weather app before sailing: useful, but you still watch the sky.",
            takeaway: "Risk hides where the data does not look.",
          },
          {
            title: "How can AI support portfolio monitoring?",
            body: "AI can scan changes, flag risks, and summarize updates across holdings. It helps you notice issues faster. It is like a dashboard light in a car: it alerts you, but you still decide what to do.",
            takeaway: "AI alerts — you decide.",
          },
          {
            title: "Does AI remove investment risk?",
            body: "No, AI can analyze risk but cannot eliminate it. Every investment still involves uncertainty, tradeoffs, and the possibility of loss.",
            takeaway: "Risk cannot be automated away.",
          },
          {
            title: "Are AI-generated numbers always reliable?",
            body: "No, AI can misread data, use outdated information, or invent unsupported figures. Always verify financial numbers against trusted sources.",
            takeaway: "Never trust an AI number without verifying the source.",
          },
        ],
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
