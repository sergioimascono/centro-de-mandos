# Integración Centro de Mando con Claude Code - Diseño

> **Para Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Permitir que Claude Code en cualquier proyecto pueda gestionar tarjetas del Centro de Mando automáticamente.

**Architecture:** Skill centralizado que se instala en proyectos cliente, con configuración interactiva y movimiento automático de tarjetas.

**Tech Stack:** Node.js API (existente), Claude Code Skills, Hooks

---

## 1. Nuevo Modelo de Tarjeta

Los archivos `.md` de tarjetas tendrán estos campos adicionales en el frontmatter YAML:

```yaml
---
id: ba17d9ed
title: Implementar autenticación OAuth
description: Añadir login con Google y Microsoft

# === CAMPOS IA ===
ai_description: |
  Esta tarea implica integrar OAuth 2.0 para permitir
  autenticación federada. Se requiere configurar los
  proveedores Google y Microsoft en la consola de
  desarrolladores, implementar el flujo de redirect,
  y almacenar tokens de forma segura.

acceptance_criteria:
  - Usuario puede hacer login con cuenta Google
  - Usuario puede hacer login con cuenta Microsoft
  - Tokens se almacenan cifrados en base de datos
  - Sesión expira correctamente tras 24h
  - Tests e2e cubren ambos flujos

linked_plan: docs/plans/2026-03-06-oauth-implementation.md

# === CAMPOS EXISTENTES ===
priority: high
tags: [auth, security]
created: '2026-03-06T10:00:00.000Z'
updated: '2026-03-06T15:30:00.000Z'
---
```

### Campos nuevos:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ai_description` | string | Descripción ampliada generada por IA |
| `acceptance_criteria` | array | Lista de criterios verificables |
| `linked_plan` | string | Ruta al archivo del plan de implementación |

---

## 2. Skill Centralizado: centro-de-mando.md

Ubicación: `.claude/skills/centro-de-mando.md`

### Comandos

| Comando | Acción |
|---------|--------|
| `/task` | Ver y seleccionar tarjeta del backlog |
| `/task new <título>` | Crear nueva tarjeta con análisis IA |
| `/task new-and-start <título>` | Crear y empezar a trabajar |
| `/task done` | Marcar tarea completada → mover a review |
| `/task verify` | Verificar criterios → mover a done si OK |
| `/task status` | Ver estado de tarjeta actual |
| `/task link-plan <ruta>` | Vincular plan a tarjeta actual |
| `/task config` | Cambiar proyecto vinculado |

### Flujo automático de columnas

```
backlog → in-progress → review → done
   │           │           │
   └── /task   └── /done   └── /verify
```

### Comportamiento al crear tarjeta

1. Recibe título del usuario
2. Genera `ai_description` expandiendo el contexto
3. Genera `acceptance_criteria` (3-5 criterios verificables)
4. Sugiere `priority` basada en análisis
5. Guarda en backlog
6. Opcionalmente empieza a trabajar

### Integración con superpowers

Al tomar una tarjeta, el skill debe:
1. Invocar `superpowers:brainstorming` para analizar la tarea
2. Si se crea un plan, guardarlo y vincularlo con `linked_plan`
3. Usar `superpowers:verification-before-completion` antes de `/task done`

---

## 3. Hook de Inicio

Al iniciar sesión en un proyecto con Centro de Mando configurado:

```
┌─────────────────────────────────────────────┐
│  📋 Centro de Mando - factoria-de-ventas   │
├─────────────────────────────────────────────┤
│  En progreso: 1 tarjeta                     │
│  → "Implementar OAuth" (high)               │
│                                             │
│  Backlog: 12 tarjetas                       │
│  Próxima sugerida: "Validar emails" (high)  │
├─────────────────────────────────────────────┤
│  ¿Continuar con OAuth? (s/n/otra)           │
└─────────────────────────────────────────────┘
```

---

## 4. Configuración Interactiva

### Primera ejecución de /task

Si no existe `.claude/centro-de-mando.json`:

```
┌─────────────────────────────────────────────┐
│  🔧 Configuración Centro de Mando          │
├─────────────────────────────────────────────┤
│  Servidor: http://localhost:9500 ✓         │
│                                             │
│  Proyectos disponibles:                     │
│  1. factoria-de-ventas                      │
│  2. factoria-de-licitaciones                │
│  3. [Crear nuevo proyecto]                  │
│                                             │
│  ¿Con cuál trabajas? _                      │
└─────────────────────────────────────────────┘
```

### Archivo de configuración generado

```json
{
  "enabled": true,
  "server": "http://localhost:9500",
  "project": "factoria-de-ventas",
  "auto_move": true,
  "auto_analyze": true
}
```

---

## 5. Cambios en API del Servidor

### Nuevos endpoints

```javascript
// PATCH - Actualizar campos IA de una tarjeta
PATCH /api/projects/:slug/cards/:id
Body: {
  ai_description: "...",
  acceptance_criteria: ["...", "..."],
  linked_plan: "docs/plans/..."
}

// GET - Filtrar tarjetas por columna
GET /api/projects/:slug/cards?column=in-progress

// GET - Obtener siguiente tarjeta sugerida
GET /api/projects/:slug/cards/next
// Devuelve la de mayor prioridad
```

### Cambios en parser de tarjetas

Añadir soporte para los nuevos campos YAML:
- `ai_description`
- `acceptance_criteria` (array)
- `linked_plan`

---

## 6. Documentación de Integración

Crear `README-INTEGRACION.md` con:

1. Requisitos previos
2. Instalación rápida (copiar skill)
3. Configuración interactiva (primera ejecución)
4. Tabla de comandos
5. Flujo de trabajo recomendado
6. Troubleshooting

---

## 7. Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `.claude/skills/centro-de-mando.md` | Crear - skill principal |
| `server/index.js` | Modificar - nuevos endpoints |
| `README-INTEGRACION.md` | Crear - documentación |
| `public/js/app.js` | Modificar - mostrar nuevos campos |
| `public/css/styles.css` | Modificar - estilos nuevos campos |

---

## 8. Criterios de Aceptación del Diseño

- [ ] Tarjetas soportan campos `ai_description`, `acceptance_criteria`, `linked_plan`
- [ ] Comando `/task` lista y permite seleccionar tarjetas
- [ ] Comando `/task new` crea tarjetas con análisis IA
- [ ] Movimiento automático: backlog→in-progress→review→done
- [ ] Configuración interactiva en primera ejecución
- [ ] Hook muestra estado al iniciar sesión
- [ ] Documentación clara para instalar en otros proyectos

---

*Diseño aprobado: 2026-03-06*
