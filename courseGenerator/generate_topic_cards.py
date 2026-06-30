"""
Topic Card Generator
====================
Generates 20 cards per topic (100 total) for 5 predefined course topics
using OpenAI, then saves to Academy Supabase and a local JSON file.

Run:
    python3 generate_topic_cards.py

Output:
    - Bold Era Academy Supabase → cards table (reviewed = false)
    - topic_cards.json          → local backup
"""

import os
import json
import time
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# ── Config ─────────────────────────────────────────────────────────────────────

load_dotenv(Path(__file__).parent.parent / ".env.local")

ACADEMY_SUPABASE_URL              = os.environ["ACADEMY_SUPABASE_URL"]
ACADEMY_SUPABASE_SERVICE_ROLE_KEY = os.environ["ACADEMY_SUPABASE_SERVICE_ROLE_KEY"]
OPENAI_API_KEY                    = os.environ["OPENAI_API_KEY"]

OPENAI_MODEL = "gpt-4o"

academy: Client = create_client(ACADEMY_SUPABASE_URL, ACADEMY_SUPABASE_SERVICE_ROLE_KEY)
openai_client   = OpenAI(api_key=OPENAI_API_KEY)

# ── Topics ─────────────────────────────────────────────────────────────────────

TOPICS = [
    {
        "topic": "AI for Everyone",
        "description": "A friendly introduction to AI concepts for people with no technical background. Covers what AI is, how it affects daily life, common myths, and how to think about AI tools.",
        "audience": "general public, non-technical",
    },
    {
        "topic": "Step-By-Step: Build Your First AI Agent in 5 Minutes",
        "description": "A practical, beginner-friendly walkthrough of building a simple AI agent. Covers what an agent is, the basic components, and how to get one running quickly with minimal setup.",
        "audience": "beginners, curious non-developers",
    },
    {
        "topic": "Step-By-Step: Create Your First AI Skill in 5 Minutes",
        "description": "A hands-on guide to creating your first Claude skill or custom AI capability. Covers what a skill is, how to define it, and how to connect it to a workflow.",
        "audience": "beginners, no-code and low-code users",
    },
    {
        "topic": "AI for Professionals",
        "description": "How working professionals can use AI tools to be more productive. Covers AI assistants, prompt strategies, automating repetitive work, and integrating AI into professional workflows.",
        "audience": "office workers, managers, knowledge workers",
    },
    {
        "topic": "AI for Finance and Investment",
        "description": "How AI is used in financial analysis, investment research, portfolio management, and risk assessment. Covers AI-powered tools, limitations, and how finance professionals can leverage AI responsibly.",
        "audience": "finance professionals, investors, analysts",
    },
]

CARDS_PER_TOPIC = 20

# ── Card generation prompt ─────────────────────────────────────────────────────

PROMPT = """You are designing educational cards for an online course module.

Topic: {topic}
Topic description: {description}
Target audience: {audience}

Generate exactly {count} course cards for this topic. Aim for a good mix:
- At least 5 "concept" cards (explain a key idea)
- At least 5 "faq" cards (answer a real question learners ask)
- At least 3 "analogy" cards (use an everyday comparison to explain something)
- At least 2 "misconception" cards (correct a common wrong belief)
- Remaining cards can be any type

Each card must be an object with:
  "type":     "concept" | "faq" | "analogy" | "misconception"
  "topic":    the topic name exactly as given
  "question": a specific, natural question a learner would ask (max 15 words)
  "answer":   a clear, jargon-free answer in 2–4 sentences (max 80 words)
  "analogy":  an everyday analogy (1–2 sentences) — required for "analogy" type, optional for others, null if not applicable

Rules:
- Write for the stated audience — no assumed technical knowledge unless specified
- No bullet points inside answers — plain prose only
- Make questions feel natural and specific, not generic ("What is AI?" is too broad — "Does AI actually understand what I say to it?" is better)
- Each card should stand alone and be useful on its own

Return a JSON object: {{"cards": [ ...array of {count} card objects... ]}}
"""

# ── Generate and save ──────────────────────────────────────────────────────────

def generate_cards_for_topic(topic_config: dict) -> list[dict]:
    print(f"\n  Generating {CARDS_PER_TOPIC} cards for: {topic_config['topic']}")

    prompt = PROMPT.format(
        topic=topic_config["topic"],
        description=topic_config["description"],
        audience=topic_config["audience"],
        count=CARDS_PER_TOPIC,
    )

    response = openai_client.chat.completions.create(
        model=OPENAI_MODEL,
        max_tokens=4096,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.choices[0].message.content.strip()
    result = json.loads(raw)
    cards = result.get("cards", [])
    print(f"  ✓ {len(cards)} cards generated.")
    return cards


def save_to_supabase(all_cards: list[dict]):
    print(f"\nSaving {len(all_cards)} cards to Academy Supabase...")

    # Insert in batches of 50
    batch_size = 50
    for i in range(0, len(all_cards), batch_size):
        batch = all_cards[i:i + batch_size]
        rows = [
            {
                "type":      card.get("type", "concept"),
                "topic":     card.get("topic", ""),
                "question":  card.get("question", ""),
                "answer":    card.get("answer", ""),
                "analogy":   card.get("analogy"),
                "frequency": 0,
                "reviewed":  False,
            }
            for card in batch
        ]
        academy.table("cards").insert(rows).execute()
        print(f"  Saved batch {i // batch_size + 1} ({len(rows)} cards).")


def save_to_json(all_cards: list[dict], path="topic_cards.json"):
    output = Path(__file__).parent / path
    with open(output, "w", encoding="utf-8") as f:
        json.dump(all_cards, f, indent=2, ensure_ascii=False)
    print(f"\nLocal backup saved to: {output}")


def print_summary(all_cards: list[dict]):
    print("\n── Summary ──────────────────────────────────────────────")
    by_topic: dict[str, list] = {}
    for card in all_cards:
        by_topic.setdefault(card["topic"], []).append(card["type"])

    for topic, types in by_topic.items():
        counts = {t: types.count(t) for t in set(types)}
        counts_str = ", ".join(f"{v} {k}" for k, v in sorted(counts.items()))
        print(f"  {topic}: {len(types)} cards ({counts_str})")

    print(f"\nTotal: {len(all_cards)} cards | reviewed = false (ready for your review)")


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    print("── Topic Card Generator ─────────────────────────────────")
    print(f"  Academy: {ACADEMY_SUPABASE_URL}")
    print(f"  Model:   {OPENAI_MODEL}")
    print(f"  Topics:  {len(TOPICS)} × {CARDS_PER_TOPIC} cards = {len(TOPICS) * CARDS_PER_TOPIC} total")

    all_cards = []

    for topic_config in TOPICS:
        try:
            cards = generate_cards_for_topic(topic_config)
            all_cards.extend(cards)
            time.sleep(1)  # rate limit courtesy
        except Exception as e:
            print(f"  [error] Failed for '{topic_config['topic']}': {e}")

    if not all_cards:
        print("\nNo cards generated. Check your OPENAI_API_KEY.")
        return

    save_to_supabase(all_cards)
    save_to_json(all_cards)
    print_summary(all_cards)


if __name__ == "__main__":
    main()
