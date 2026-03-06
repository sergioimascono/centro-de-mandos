# Centro de Mando

Dashboard Kanban basado en archivos para gestionar proyectos de Claude Code.

## Quick Start

```bash
npm install
npm start
```

Abrir http://localhost:9500

## Estructura

```
projects/
└── {proyecto}/
    ├── backlog/
    ├── todo/
    ├── in-progress/
    ├── review/
    └── done/
        └── {id}.md
```

## Formato de Tarjeta

```yaml
---
id: "abc123"
title: "Titulo"
description: "Descripcion"
priority: "high"
tags: ["tag1"]
created: "2026-03-06T12:00:00Z"
updated: "2026-03-06T12:00:00Z"
---

Contenido markdown...
```

## API

- `GET /api/projects` - Lista proyectos
- `GET /api/projects/:slug/cards` - Tarjetas de un proyecto
- `POST /api/projects/:slug/cards` - Crear tarjeta
- `POST /api/projects/:slug/cards/:id/move` - Mover tarjeta
- `DELETE /api/projects/:slug/cards/:id` - Eliminar tarjeta

## Integracion

Ver `INTEGRATION.md` para conectar otros proyectos.
