"""
YouTube Playlist Transcript Collector & Topic Summarizer
=========================================================
Pulls transcripts from a YouTube playlist and uses Claude
to summarize content by topic — for course research purposes.

Setup:
    pip install youtube-transcript-api google-api-python-client anthropic

Required API keys (set as environment variables):
    YOUTUBE_API_KEY   — from console.cloud.google.com (free, enable "YouTube Data API v3")
    ANTHROPIC_API_KEY — from console.anthropic.com
"""

import os
import json
import time
from pathlib import Path
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import anthropic

# ── Config ────────────────────────────────────────────────────────────────────

YOUTUBE_API_KEY  = os.environ.get("YOUTUBE_API_KEY")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

OUTPUT_DIR = Path("transcripts")          # raw transcripts saved here
SUMMARY_FILE = Path("topic_summary.json") # final topic summary saved here

# ── Step 1: Get all video IDs from a playlist ─────────────────────────────────

def get_playlist_video_ids(playlist_id: str) -> list[dict]:
    """Returns list of {video_id, title} dicts for all videos in a playlist."""
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    videos = []
    next_page_token = None

    print(f"Fetching video list from playlist: {playlist_id}")

    while True:
        response = youtube.playlistItems().list(
            part="snippet",
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        ).execute()

        for item in response["items"]:
            snippet = item["snippet"]
            videos.append({
                "video_id": snippet["resourceId"]["videoId"],
                "title": snippet["title"],
            })

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    print(f"  Found {len(videos)} videos.")
    return videos


# ── Step 2: Download transcripts ──────────────────────────────────────────────

def fetch_transcript(video_id: str) -> str | None:
    """Fetches the transcript for a video. Returns plain text or None."""
    try:
        entries = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join(e["text"] for e in entries)
    except TranscriptsDisabled:
        print(f"  [skip] Transcripts disabled: {video_id}")
        return None
    except NoTranscriptFound:
        print(f"  [skip] No transcript found: {video_id}")
        return None
    except Exception as e:
        print(f"  [error] {video_id}: {e}")
        return None


def collect_transcripts(videos: list[dict], save_raw=True) -> list[dict]:
    """
    Fetches transcripts for all videos.
    Saves each to transcripts/<video_id>.txt if save_raw=True.
    Returns list of {video_id, title, transcript} dicts.
    """
    OUTPUT_DIR.mkdir(exist_ok=True)
    results = []

    for i, video in enumerate(videos, 1):
        vid = video["video_id"]
        title = video["title"]
        cached_path = OUTPUT_DIR / f"{vid}.txt"

        # Use cached transcript if already downloaded
        if cached_path.exists():
            print(f"[{i}/{len(videos)}] (cached) {title}")
            transcript = cached_path.read_text(encoding="utf-8")
        else:
            print(f"[{i}/{len(videos)}] Fetching: {title}")
            transcript = fetch_transcript(vid)
            if transcript and save_raw:
                cached_path.write_text(transcript, encoding="utf-8")
            time.sleep(0.5)  # be polite

        if transcript:
            results.append({"video_id": vid, "title": title, "transcript": transcript})

    print(f"\nDownloaded {len(results)}/{len(videos)} transcripts.")
    return results


# ── Step 3: Summarize by topic with Claude ────────────────────────────────────

def chunk_transcripts(transcripts: list[dict], max_chars=80_000) -> list[str]:
    """
    Packs transcripts into chunks under max_chars each
    so we don't exceed Claude's context window.
    """
    chunks = []
    current_chunk = ""

    for t in transcripts:
        block = f"\n\n### VIDEO: {t['title']}\n{t['transcript']}"
        if len(current_chunk) + len(block) > max_chars:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = block
        else:
            current_chunk += block

    if current_chunk:
        chunks.append(current_chunk)

    return chunks


def summarize_with_claude(transcripts: list[dict]) -> dict:
    """
    Sends transcript chunks to Claude and asks it to:
    1. Extract key topics covered across all videos
    2. Summarize what each video says about those topics
    3. Identify gaps and recurring themes

    Returns a structured summary dict.
    """
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    chunks = chunk_transcripts(transcripts)
    partial_summaries = []

    print(f"\nSending {len(chunks)} chunk(s) to Claude for analysis...")

    for i, chunk in enumerate(chunks, 1):
        print(f"  Analyzing chunk {i}/{len(chunks)}...")
        message = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""You are helping build an online course on AI and LLMs for a general audience.

Below are transcripts from {len(transcripts)} YouTube videos. Analyze them and produce:

1. **Key Topics** — a list of the main concepts covered across all videos
2. **Per-Topic Summary** — for each topic, summarize what the videos collectively say about it (2-4 sentences)
3. **Recurring Themes** — ideas or explanations that come up across multiple videos
4. **Gaps** — important AI/LLM concepts that seem missing or undercovered
5. **Best Explanations** — note any particularly clear analogies or explanations worth adapting

Format your response as JSON with keys: topics, per_topic_summary, recurring_themes, gaps, best_explanations

---
{chunk}
"""
            }]
        )
        partial_summaries.append(message.content[0].text)

    # If multiple chunks, do a final synthesis pass
    if len(partial_summaries) > 1:
        print("  Synthesizing across chunks...")
        combined = "\n\n---\n\n".join(partial_summaries)
        final = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""You analyzed YouTube transcripts in multiple batches. Here are the partial analyses:

{combined}

Now synthesize these into a single unified analysis with the same JSON structure:
topics, per_topic_summary, recurring_themes, gaps, best_explanations

Merge duplicates and resolve any contradictions."""
            }]
        )
        raw = final.content[0].text
    else:
        raw = partial_summaries[0]

    # Parse JSON (Claude usually returns clean JSON in code fences)
    try:
        # Strip markdown code fences if present
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0]
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        # Return raw text if parsing fails
        return {"raw_summary": raw}


# ── Step 4: Save and display results ─────────────────────────────────────────

def save_summary(summary: dict):
    SUMMARY_FILE.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"\nSummary saved to {SUMMARY_FILE}")


def print_summary(summary: dict):
    if "raw_summary" in summary:
        print("\n── Summary ──────────────────────────────────────")
        print(summary["raw_summary"])
        return

    print("\n── KEY TOPICS ───────────────────────────────────")
    for topic in summary.get("topics", []):
        print(f"  • {topic}")

    print("\n── RECURRING THEMES ─────────────────────────────")
    for theme in summary.get("recurring_themes", []):
        print(f"  • {theme}")

    print("\n── GAPS (missing from videos) ───────────────────")
    for gap in summary.get("gaps", []):
        print(f"  • {gap}")

    print("\n── BEST EXPLANATIONS TO ADAPT ───────────────────")
    for ex in summary.get("best_explanations", []):
        print(f"  • {ex}")

    print(f"\nFull per-topic summaries saved to {SUMMARY_FILE}")


# ── Main ──────────────────────────────────────────────────────────────────────

def run(playlist_id: str):
    # 1. Get video list
    videos = get_playlist_video_ids(playlist_id)

    # 2. Download transcripts
    transcripts = collect_transcripts(videos)

    if not transcripts:
        print("No transcripts found. Exiting.")
        return

    # 3. Summarize with Claude
    summary = summarize_with_claude(transcripts)

    # 4. Save and display
    save_summary(summary)
    print_summary(summary)


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python youtube_course_builder.py PLAYLIST_ID")
        print("")
        print("Example:")
        print("  python youtube_course_builder.py PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi")
        print("")
        print("The playlist ID is the part after 'list=' in a YouTube playlist URL.")
        sys.exit(1)

    run(sys.argv[1])
