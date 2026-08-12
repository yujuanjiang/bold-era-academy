# Bold Era Academy Course Sources

This is the master folder for original course-source material. Keep source text, drafts, metadata, and resource origins here before moving polished content into the app.

## Folder Pattern

`course-sources/{course-id}/course.md`
`course-sources/{course-id}/{chapter-id}/source.md`

Each course folder contains:

- `course.md`: course description, front matter metadata, and chapter index
- one folder for each chapter/topic

Each chapter folder contains one file:

- `source.md`: chapter content, front matter metadata, and resource origins in one Markdown file

## Why One Source File

Keeping each course/chapter source in Markdown makes it easier to search, review, move into AI prompts, and aggregate into future course-generation workflows.

## Current Courses

1. [AI for Everyone](./ai-for-everyone/course.md)
2. [AI for Entrepreneurs](./ai-for-entrepreneurs/course.md)
3. [Build Your First AI Agent](./build-ai-agent/course.md)
4. [Create Your First AI Skill](./create-ai-skill/course.md)
5. [AI for Professionals](./ai-for-professionals/course.md)
6. [AI for Finance and Investing](./ai-for-finance/course.md)

## Adding New Content

1. Create or choose the course folder.
2. Create a chapter/topic subfolder using a short slug.
3. Add one `source.md` file using the chapter template.
4. Put the learning content, metadata, and resource origins in that single file.
5. Record every meaningful resource origin with URL, author/organization, published date when available, and accessed date.
6. Only after the source file is ready, copy or transform the content into the app data files.
