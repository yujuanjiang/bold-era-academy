"""
Course Card Pipeline
====================
Three-stage pipeline:
  1. Extract  — per-document LLM extraction → extracted_insights table
  2. Cluster  — cross-document aggregation  → topic_clusters table
  3. Generate — card generation             → cards table

Setup:
    pip install supabase openai python-dotenv

Environment variables (loaded automatically from .env.local in the project root):
    PRISM_SUPABASE_URL              — BoldEra-Prism project URL (source: scraped data)
    PRISM_SUPABASE_SERVICE_ROLE_KEY — BoldEra-Prism service role key
    ACADEMY_SUPABASE_URL              — Bold Era Academy project URL (destination: course content)
    ACADEMY_SUPABASE_SERVICE_ROLE_KEY — Bold Era Academy service role key
    OPENAI_API_KEY                  — from platform.openai.com

SQL to create tables (run once in Supabase SQL editor):
─────────────────────────────────────────────────────────
    create table if not exists extracted_insights (
        id              uuid primary key default gen_random_uuid(),
        raw_content_id  bigint, -- references BoldEra-Prism source_items(id), no FK constraint
        type            text,   -- 'question' | 'concept' | 'analogy' | 'misconception'
        text            text,
        topic_hint      text,
        created_at      timestamptz default now()
    );

    create table if not exists topic_clusters (
        id          uuid primary key default gen_random_uuid(),
        topic       text,
        frequency   int,
        insight_ids uuid[],
        created_at  timestamptz default now()
    );

    create table if not exists cards (
        id          uuid primary key default gen_random_uuid(),
        cluster_id  uuid references topic_clusters(id),
        type        text,   -- 'concept' | 'faq' | 'analogy' | 'misconception'
        topic       text,
        question    text,
        answer      text,
        analogy     text,
        sources     text[],
        frequency   int,
        reviewed    boolean default false,
        created_at  timestamptz default now()
    );
─────────────────────────────────────────────────────────
"""

import os
import json
import time
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# ── Config ─────────────────────────────────────────────────────────────────────

# Load .env.local from the project root (one level above this script)
load_dotenv(Path(__file__).parent.parent / ".env.local")

PRISM_SUPABASE_URL               = os.environ["PRISM_SUPABASE_URL"]
PRISM_SUPABASE_SERVICE_ROLE_KEY  = os.environ["PRISM_SUPABASE_SERVICE_ROLE_KEY"]
ACADEMY_SUPABASE_URL              = os.environ["ACADEMY_SUPABASE_URL"]
ACADEMY_SUPABASE_SERVICE_ROLE_KEY = os.environ["ACADEMY_SUPABASE_SERVICE_ROLE_KEY"]
OPENAI_API_KEY                   = os.environ["OPENAI_API_KEY"]

OPENAI_MODEL = "gpt-4o"

# prism  → source (scraped data: raw_content)
# academy → destination (course content: extracted_insights, topic_clusters, cards)
prism: Client   = create_client(PRISM_SUPABASE_URL, PRISM_SUPABASE_SERVICE_ROLE_KEY)
academy: Client = create_client(ACADEMY_SUPABASE_URL, ACADEMY_SUPABASE_SERVICE_ROLE_KEY)
openai_client   = OpenAI(api_key=OPENAI_API_KEY)


# ── Helpers ───────────────────────────────────────────────────────────────────

def call_openai(prompt: str, max_tokens=2048) -> dict:
    """Call OpenAI and parse JSON from the response."""
    response = openai_client.chat.completions.create(
        model=OPENAI_MODEL,
        max_tokens=max_tokens,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}]
    )
    raw = response.choices[0].message.content.strip()
    return json.loads(raw)


def already_processed(raw_content_id: str) -> bool:
    """Check if a document has already been extracted (idempotent runs)."""
    result = (
        academy.table("extracted_insights")
        .select("id", count="exact")
        .eq("raw_content_id", raw_content_id)
        .execute()
    )
    return result.count > 0


# ── Stage 1: Extract insights per document ────────────────────────────────────

EXTRACTION_PROMPT = """You are building an online course on AI and LLMs for a general audience.

Analyze the following content and extract structured insights.

Return a JSON object with these arrays:
- "questions": things the audience genuinely asks or is confused about (from comments, or implied by the content)
- "concepts": key AI/LLM concepts explained or mentioned
- "analogies": any metaphors or analogies used to explain technical ideas
- "misconceptions": wrong beliefs or common mistakes the content addresses

Each item should be an object with:
  - "text": the insight in one clear sentence
  - "topic_hint": the broad topic this belongs to (e.g. "Transformers", "Tokenization", "Training", "Prompting")

Return ONLY valid JSON. No explanation outside the JSON.

---
SOURCE TYPE: {source_type}
CONTENT:
{content}
"""


def extract_insights(raw_content_id: str, source_type: str, content: str):
    """Run LLM extraction on one document and save results to Supabase."""
    if already_processed(raw_content_id):
        print(f"  [skip] Already extracted: {raw_content_id}")
        return

    print(f"  Extracting from {source_type}: {raw_content_id[:8]}...")

    prompt = EXTRACTION_PROMPT.format(
        source_type=source_type,
        content=content[:12000]  # trim very long docs
    )

    try:
        result = call_openai(prompt)
    except Exception as e:
        print(f"  [error] Extraction failed: {e}")
        return

    rows = []
    type_map = {
        "questions":      "question",
        "concepts":       "concept",
        "analogies":      "analogy",
        "misconceptions": "misconception",
    }

    for key, insight_type in type_map.items():
        for item in result.get(key, []):
            rows.append({
                "raw_content_id": raw_content_id,
                "type":           insight_type,
                "text":           item.get("text", ""),
                "topic_hint":     item.get("topic_hint", "General"),
            })

    if rows:
        academy.table("extracted_insights").insert(rows).execute()
        print(f"  Saved {len(rows)} insights.")

    time.sleep(0.5)  # rate limit courtesy


def run_extraction():
    """Stage 1: Process all unprocessed documents in raw_content."""
    print("\n── Stage 1: Extraction ──────────────────────────────────")
    print(f"  Prism URL: {PRISM_SUPABASE_URL}")
    print(f"  Academy URL: {ACADEMY_SUPABASE_URL}")
    count_check = prism.table("source_items").select("id", count="exact").execute()
    print(f"  source_items rows visible to script: {count_check.count}")
    docs = prism.table("source_items").select("id, source, raw_text").execute()

    for doc in docs.data:
        if not doc.get("raw_text"):
            continue  # skip rows with no content
        extract_insights(doc["id"], doc["source"], doc["raw_text"])

    print(f"Extraction complete. {len(docs.data)} documents processed.")


# ── Stage 2: Cluster insights across documents ────────────────────────────────

CLUSTERING_PROMPT = """You are organizing raw insights extracted from AI/LLM educational content.

Below are {count} insights with their topic hints. Your job:
1. Group them into coherent topic clusters (aim for 10–30 clusters)
2. Give each cluster a clean topic name
3. List which insight IDs belong to each cluster

Return JSON:
{{
  "clusters": [
    {{
      "topic": "Attention Mechanism",
      "insight_ids": ["id1", "id2", ...],
      "frequency": 5
    }},
    ...
  ]
}}

Return ONLY valid JSON.

---
INSIGHTS:
{insights_json}
"""


def run_clustering():
    """Stage 2: Cluster all extracted insights into topics."""
    print("\n── Stage 2: Clustering ──────────────────────────────────")

    # Clear old clusters before re-running
    academy.table("topic_clusters").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    insights = (
        academy.table("extracted_insights")
        .select("id, type, text, topic_hint")
        .execute()
    )

    if not insights.data:
        print("No insights found. Run extraction first.")
        return

    print(f"Clustering {len(insights.data)} insights...")

    # Truncate each insight to keep the prompt manageable
    compact = [
        {"id": r["id"], "type": r["type"], "text": r["text"][:200], "topic_hint": r["topic_hint"]}
        for r in insights.data
    ]

    # If too many insights, chunk them
    CHUNK_SIZE = 200
    all_clusters = []

    for i in range(0, len(compact), CHUNK_SIZE):
        chunk = compact[i:i + CHUNK_SIZE]
        prompt = CLUSTERING_PROMPT.format(
            count=len(chunk),
            insights_json=json.dumps(chunk, indent=2)
        )
        try:
            result = call_openai(prompt, max_tokens=4096)
            all_clusters.extend(result.get("clusters", []))
            print(f"  Chunk {i // CHUNK_SIZE + 1}: {len(result.get('clusters', []))} clusters found.")
        except Exception as e:
            print(f"  [error] Clustering chunk failed: {e}")

        time.sleep(1)

    # Save clusters
    rows = [
        {
            "topic":       c["topic"],
            "frequency":   c.get("frequency", len(c.get("insight_ids", []))),
            "insight_ids": c.get("insight_ids", []),
        }
        for c in all_clusters
    ]

    if rows:
        academy.table("topic_clusters").insert(rows).execute()
        print(f"Saved {len(rows)} topic clusters.")


# ── Stage 3: Generate cards ───────────────────────────────────────────────────

CARD_PROMPT = """You are writing educational cards for an online AI/LLM course targeting a general audience (no coding background required).

Topic: {topic}
Insights from source material:
{insights_text}

Write a set of course cards for this topic. Return a JSON array of cards:
[
  {{
    "type": "concept",
    "question": "What is {topic}?",
    "answer": "Clear, jargon-free explanation in 2–4 sentences.",
    "analogy": "An everyday analogy that makes this click (1–2 sentences). Null if none fits."
  }},
  {{
    "type": "faq",
    "question": "A real question learners ask about this topic",
    "answer": "Direct, plain-English answer.",
    "analogy": null
  }},
  {{
    "type": "misconception",
    "question": "Common wrong belief about this topic",
    "answer": "Why it's wrong and what the truth is.",
    "analogy": null
  }}
]

Rules:
- Generate 2–5 cards per topic (quality over quantity)
- "concept" card is mandatory; others only if the insights support them
- Keep answers under 100 words each
- No bullet points inside answers — write in plain prose
- Return a JSON object with a single key "cards" containing the array.
"""


def run_card_generation():
    """Stage 3: Generate cards for each topic cluster."""
    print("\n── Stage 3: Card Generation ─────────────────────────────")

    # Clear old unreviewed cards
    academy.table("cards").delete().eq("reviewed", False).execute()

    clusters = (
        academy.table("topic_clusters")
        .select("id, topic, frequency, insight_ids")
        .order("frequency", desc=True)
        .execute()
    )

    if not clusters.data:
        print("No clusters found. Run clustering first.")
        return

    total_cards = 0

    for cluster in clusters.data:
        topic = cluster["topic"]
        cluster_id = cluster["id"]
        insight_ids = cluster.get("insight_ids") or []

        print(f"  Generating cards for: {topic} (freq={cluster['frequency']})")

        # Fetch the actual insight text for this cluster
        if insight_ids:
            insights = (
                academy.table("extracted_insights")
                .select("type, text")
                .in_("id", insight_ids[:30])  # cap at 30 per cluster
                .execute()
            )
            insights_text = "\n".join(
                f"- [{r['type']}] {r['text']}" for r in insights.data
            )
        else:
            insights_text = "(no specific insights — use general knowledge)"

        prompt = CARD_PROMPT.format(topic=topic, insights_text=insights_text)

        try:
            result = call_openai(prompt, max_tokens=2048)
            cards = result.get("cards", [])
        except Exception as e:
            print(f"  [error] Card generation failed for {topic}: {e}")
            continue

        rows = [
            {
                "cluster_id": cluster_id,
                "type":       card.get("type", "concept"),
                "topic":      topic,
                "question":   card.get("question", ""),
                "answer":     card.get("answer", ""),
                "analogy":    card.get("analogy"),
                "sources":    insight_ids[:10],
                "frequency":  cluster["frequency"],
                "reviewed":   False,
            }
            for card in cards
        ]

        if rows:
            academy.table("cards").insert(rows).execute()
            total_cards += len(rows)

        time.sleep(0.5)

    print(f"\nCard generation complete. {total_cards} cards created.")
    print("Next step: review cards in Supabase and set reviewed = true.")


# ── Review helper: print unreviewed cards ────────────────────────────────────

def print_unreviewed_cards(limit=20):
    """Print a sample of unreviewed cards for quick inspection."""
    cards = (
        academy.table("cards")
        .select("topic, type, question, answer, analogy, frequency")
        .eq("reviewed", False)
        .order("frequency", desc=True)
        .limit(limit)
        .execute()
    )

    print(f"\n── {len(cards.data)} unreviewed cards (top {limit} by frequency) ──")
    for card in cards.data:
        print(f"\n[{card['type'].upper()}] {card['topic']} (freq={card['frequency']})")
        print(f"  Q: {card['question']}")
        print(f"  A: {card['answer']}")
        if card.get("analogy"):
            print(f"  ~: {card['analogy']}")


# ── Export approved cards ─────────────────────────────────────────────────────

def export_reviewed_cards(output_path="reviewed_cards.json"):
    """Export all reviewed cards to a JSON file for use in your course platform."""
    cards = (
        academy.table("cards")
        .select("type, topic, question, answer, analogy, frequency")
        .eq("reviewed", True)
        .order("topic")
        .execute()
    )

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(cards.data, f, indent=2, ensure_ascii=False)

    print(f"\nExported {len(cards.data)} reviewed cards to {output_path}")


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    commands = {
        "extract":  run_extraction,
        "cluster":  run_clustering,
        "generate": run_card_generation,
        "review":   print_unreviewed_cards,
        "export":   export_reviewed_cards,
        "all":      lambda: (run_extraction(), run_clustering(), run_card_generation()),
    }

    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"

    if cmd not in commands:
        print(f"Usage: python course_card_pipeline.py [{' | '.join(commands)}]")
        print()
        print("  extract   — Stage 1: extract insights from raw_content")
        print("  cluster   — Stage 2: group insights into topic clusters")
        print("  generate  — Stage 3: generate course cards")
        print("  review    — Print unreviewed cards for inspection")
        print("  export    — Export reviewed cards to JSON")
        print("  all       — Run all three stages end-to-end")
        sys.exit(1)

    commands[cmd]()
