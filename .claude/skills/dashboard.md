# Dashboard Skill

Use this skill to interact with the Centro de Mando Kanban dashboard.

## Setup

The Centro de Mando should be running at http://localhost:9500

## Read Cards

To get all cards for a project:

```bash
curl -s http://localhost:9500/api/projects/{PROJECT_SLUG}/cards
```

## Create Card

To create a new card:

```bash
curl -s -X POST http://localhost:9500/api/projects/{PROJECT_SLUG}/cards \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task title",
    "description": "Task description",
    "priority": "medium",
    "tags": ["tag1", "tag2"],
    "column": "backlog"
  }'
```

## Move Card

To move a card between columns:

```bash
curl -s -X POST http://localhost:9500/api/projects/{PROJECT_SLUG}/cards/{CARD_ID}/move \
  -H "Content-Type: application/json" \
  -d '{"toColumn": "in-progress"}'
```

## Columns

Valid columns: `backlog`, `todo`, `in-progress`, `review`, `done`

## Priorities

Valid priorities: `low`, `medium`, `high`, `critical`
