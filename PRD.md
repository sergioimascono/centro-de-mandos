# PRD.md - Product Requirements Document

## Overview

- **Product Name**: Centro de Mando Desarrollo
- **Goal**: Dashboard Kanban basado en carpetas y Markdown para gestionar proyectos de Claude Code
- **Target Users**: Desarrolladores de Imascono usando Claude Code

## Problem Statement

Necesitamos una forma centralizada de gestionar tareas entre diferentes proyectos de Claude Code. Cada proyecto puede referenciar este centro de mando para:
- Leer sus tarjetas de trabajo pendientes
- Actualizar el estado de las tareas
- Mover tarjetas entre columnas del Kanban

## Success Criteria

- [x] Estructura de carpetas que representa columnas Kanban
- [ ] Archivos MD con frontmatter YAML como tarjetas
- [ ] Frontend sencillo para crear/editar/mover tarjetas
- [ ] Skill reutilizable para que otros proyectos interactúen
- [ ] Puerto fijo localhost:9500

## Features

### Feature 1: Estructura Kanban basada en carpetas
- Description: Cada proyecto tiene su carpeta con subcarpetas que representan columnas del Kanban
- User Story: Como desarrollador, quiero que mis tareas estén organizadas en carpetas para que Claude Code pueda leerlas fácilmente
- Acceptance Criteria:
  - [ ] Carpeta por proyecto
  - [ ] Subcarpetas: backlog, todo, in-progress, review, done
  - [ ] Archivos .md con frontmatter YAML

### Feature 2: Frontend Dashboard
- Description: Interfaz web sencilla para visualizar y gestionar tarjetas
- User Story: Como desarrollador, quiero una interfaz visual para crear y mover tarjetas sin editar archivos manualmente
- Acceptance Criteria:
  - [ ] Vista Kanban por proyecto
  - [ ] Crear/editar tarjetas con formulario
  - [ ] Drag & drop entre columnas
  - [ ] Puerto fijo 9500

### Feature 3: Skill de Integracion
- Description: Skill que otros proyectos pueden usar para interactuar con el dashboard
- User Story: Como Claude Code en otro proyecto, quiero poder leer mis tareas y actualizarlas
- Acceptance Criteria:
  - [ ] Leer tarjetas del proyecto
  - [ ] Crear nuevas tarjetas
  - [ ] Mover tarjetas entre estados
  - [ ] Actualizar contenido de tarjetas

## In Scope

- Kanban basado en archivos MD
- Frontend HTML/CSS/JS vanilla
- Servidor local simple (Node.js)
- Skill para Claude Code
- Branding Imascono

## Out of Scope

- Base de datos (usamos sistema de archivos)
- Autenticación (es local)
- Sincronización cloud
- Colaboración multi-usuario en tiempo real

## Non-Goals

- No es un reemplazo de Jira/Trello para equipos grandes
- No necesita ser accesible desde internet

## Dependencies

- Node.js para servidor local
- Sistema de archivos para persistencia
- Tipografía Inter (Google Fonts) como alternativa a Visuelt PRO

## Timeline

- Phase 1: Estructura de carpetas + documentación
- Phase 2: Frontend básico funcional
- Phase 3: Skill de integración
