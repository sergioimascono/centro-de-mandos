# BACKEND_STRUCTURE.md - API & File Structure

## File System Structure (Database)

No usamos base de datos tradicional. El sistema de archivos ES la base de datos:

```
Centro de Mando Desarrollo/
├── projects/                    # Carpeta raíz de proyectos
│   ├── {project-slug}/          # Carpeta de cada proyecto
│   │   ├── backlog/             # Columna: Backlog
│   │   │   └── {card-id}.md     # Tarjeta
│   │   ├── todo/                # Columna: To Do
│   │   ├── in-progress/         # Columna: In Progress
│   │   ├── review/              # Columna: Review
│   │   └── done/                # Columna: Done
│   └── ...
└── server/                      # Código del servidor
```

## Card Schema (Frontmatter YAML)

```yaml
---
id: string           # UUID único
title: string        # Título (requerido)
description: string  # Descripción corta
priority: enum       # "low" | "medium" | "high" | "critical"
tags: string[]       # Array de etiquetas
created: datetime    # ISO 8601
updated: datetime    # ISO 8601
assignee: string     # Opcional: responsable
due_date: datetime   # Opcional: fecha límite
---

# Contenido Markdown

Notas adicionales, referencias, checklist, etc.
```

## API Endpoints

### Projects

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | /api/projects | Lista todos los proyectos | `Project[]` |
| POST | /api/projects | Crear nuevo proyecto | `Project` |
| DELETE | /api/projects/:slug | Eliminar proyecto | `{success: true}` |

### Cards

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | /api/projects/:slug/cards | Todas las tarjetas del proyecto | `{[column]: Card[]}` |
| GET | /api/projects/:slug/cards/:id | Una tarjeta específica | `Card` |
| POST | /api/projects/:slug/cards | Crear tarjeta | `Card` |
| PATCH | /api/projects/:slug/cards/:id | Actualizar tarjeta | `Card` |
| DELETE | /api/projects/:slug/cards/:id | Eliminar tarjeta | `{success: true}` |
| POST | /api/projects/:slug/cards/:id/move | Mover tarjeta a otra columna | `Card` |

## Request/Response Examples

### GET /api/projects

**Response (200):**
```json
{
  "projects": [
    {
      "slug": "escritor-memorias",
      "name": "Escritor de Memorias",
      "cardCount": {
        "backlog": 5,
        "todo": 3,
        "in-progress": 2,
        "review": 1,
        "done": 10
      }
    }
  ]
}
```

### GET /api/projects/:slug/cards

**Response (200):**
```json
{
  "backlog": [
    {
      "id": "abc-123",
      "title": "Implementar login",
      "description": "Sistema de autenticación",
      "priority": "high",
      "tags": ["auth", "backend"],
      "created": "2026-03-06T12:00:00Z",
      "updated": "2026-03-06T12:00:00Z"
    }
  ],
  "todo": [],
  "in-progress": [],
  "review": [],
  "done": []
}
```

### POST /api/projects/:slug/cards

**Request:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "priority": "medium",
  "tags": ["frontend"],
  "column": "backlog"
}
```

**Response (201):**
```json
{
  "id": "generated-uuid",
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "priority": "medium",
  "tags": ["frontend"],
  "column": "backlog",
  "created": "2026-03-06T14:30:00Z",
  "updated": "2026-03-06T14:30:00Z"
}
```

### POST /api/projects/:slug/cards/:id/move

**Request:**
```json
{
  "toColumn": "in-progress"
}
```

**Response (200):**
```json
{
  "id": "abc-123",
  "column": "in-progress",
  "updated": "2026-03-06T15:00:00Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Proyecto o tarjeta no existe |
| 500 | Internal Server Error - Error de sistema de archivos |

## Validation Rules

### Card Creation
- title: requerido, min 1 char, max 200 chars
- description: opcional, max 2000 chars
- priority: "low" | "medium" | "high" | "critical" (default: "medium")
- tags: array de strings, cada tag max 50 chars
- column: "backlog" | "todo" | "in-progress" | "review" | "done" (default: "backlog")

### Project Creation
- slug: requerido, lowercase, sin espacios (kebab-case)
- Solo caracteres: a-z, 0-9, -

## File Naming Convention

- Tarjetas: `{id}.md` donde id es UUID v4 truncado (primeros 8 caracteres)
- Ejemplo: `a1b2c3d4.md`

## Server Configuration

```javascript
const config = {
  port: 9500,                    // Puerto fijo
  projectsDir: './projects',     // Directorio de proyectos
  columns: ['backlog', 'todo', 'in-progress', 'review', 'done']
};
```
