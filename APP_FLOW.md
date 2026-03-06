# APP_FLOW.md - User Flows and Navigation

## Screen Inventory

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Vista general de todos los proyectos |
| `/project/:slug` | Project Kanban | Vista Kanban de un proyecto específico |
| `/card/new` | New Card Modal | Modal para crear nueva tarjeta |
| `/card/:id/edit` | Edit Card Modal | Modal para editar tarjeta existente |

## User Flows

### Flow 1: Ver Dashboard

```
Abrir localhost:9500 → Dashboard
    ↓
Lista de proyectos (carpetas en /projects)
    ↓
Click en proyecto → Vista Kanban del proyecto
```

**Steps:**
1. Usuario abre http://localhost:9500
2. Ve lista de proyectos disponibles
3. Cada proyecto muestra contador de tarjetas por estado

**Success State:** Usuario ve todos sus proyectos
**Error States:**
- Servidor no disponible → Mensaje de error

### Flow 2: Gestionar Tarjetas Kanban

```
Vista Kanban → Ver columnas (backlog, todo, in-progress, review, done)
    ↓
Drag tarjeta → Drop en otra columna
    ↓
Archivo .md movido a nueva carpeta
```

**Steps:**
1. Usuario entra a un proyecto
2. Ve las 5 columnas del Kanban
3. Puede arrastrar tarjetas entre columnas
4. El archivo .md se mueve de carpeta automáticamente

**Success State:** Tarjeta aparece en nueva columna
**Error States:**
- Error de escritura → Mostrar toast de error

### Flow 3: Crear Nueva Tarjeta

```
Click "+" en columna → Modal de nueva tarjeta
    ↓
Llenar formulario (título, descripción, prioridad, tags)
    ↓
Click "Crear" → Archivo .md creado en carpeta correspondiente
```

**Steps:**
1. Usuario hace click en "+" de una columna
2. Se abre modal con formulario
3. Llena: título (requerido), descripción, prioridad, tags
4. Click en "Crear"
5. Se genera archivo .md con frontmatter YAML
6. Tarjeta aparece en la columna

**Success State:** Nueva tarjeta visible en Kanban
**Error States:**
- Título vacío → Validación
- Error de escritura → Toast de error

### Flow 4: Editar Tarjeta

```
Click en tarjeta → Modal de edición
    ↓
Modificar campos
    ↓
Click "Guardar" → Archivo .md actualizado
```

**Steps:**
1. Click en una tarjeta
2. Se abre modal con datos actuales
3. Editar campos necesarios
4. Click "Guardar"
5. Archivo .md actualizado

**Success State:** Cambios reflejados en tarjeta
**Error States:**
- Error de escritura → Toast de error

### Flow 5: Claude Code Lee Tarjetas (via Skill)

```
Claude Code en otro proyecto → Ejecuta skill /dashboard
    ↓
Lee carpeta del proyecto en Centro de Mando
    ↓
Devuelve lista de tarjetas por estado
```

**Steps:**
1. Claude Code ejecuta skill de dashboard
2. Skill lee carpetas del proyecto
3. Parsea archivos .md con gray-matter
4. Devuelve estructura de datos

**Success State:** Claude Code tiene contexto de tareas
**Error States:**
- Proyecto no existe → Error descriptivo

## Navigation Structure

```
├── Dashboard (/)
│   └── Lista de Proyectos
│       └── Click → Project Kanban
│
├── Project Kanban (/project/:slug)
│   ├── Header con nombre de proyecto
│   ├── 5 Columnas Kanban
│   │   ├── Backlog
│   │   ├── Todo
│   │   ├── In Progress
│   │   ├── Review
│   │   └── Done
│   └── Cada columna tiene:
│       ├── Header (nombre + contador)
│       ├── Botón "+" para nueva tarjeta
│       └── Lista de tarjetas (drag & drop)
│
└── Modales (overlays)
    ├── Nueva Tarjeta
    └── Editar Tarjeta
```

## Redirects

| Condition | From | To |
|-----------|------|-----|
| Proyecto no existe | /project/xxx | / (dashboard) |
| Path inválido | /cualquier-cosa | / (dashboard) |

## Estructura de Carpetas (Kanban)

```
projects/
├── proyecto-ejemplo/
│   ├── backlog/
│   │   └── tarea-001.md
│   ├── todo/
│   │   └── tarea-002.md
│   ├── in-progress/
│   │   └── tarea-003.md
│   ├── review/
│   │   └── tarea-004.md
│   └── done/
│       └── tarea-005.md
└── otro-proyecto/
    ├── backlog/
    ├── todo/
    ├── in-progress/
    ├── review/
    └── done/
```

## Formato de Tarjeta (.md)

```yaml
---
id: "uuid-generado"
title: "Título de la tarea"
description: "Descripción detallada"
priority: "high" # low | medium | high | critical
tags: ["frontend", "bug"]
created: "2026-03-06T12:00:00Z"
updated: "2026-03-06T14:30:00Z"
---

## Notas adicionales

Contenido markdown libre para detalles, referencias, etc.
```
