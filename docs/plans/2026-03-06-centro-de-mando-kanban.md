# Centro de Mando Kanban - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a file-based Kanban dashboard for managing Claude Code projects with a simple frontend and integration skill.

**Architecture:** Express.js server serving static HTML/CSS/JS frontend. Data persisted as Markdown files with YAML frontmatter in a folder structure (projects/{slug}/{column}/*.md). API provides CRUD operations for cards and projects.

**Tech Stack:** Node.js 20, Express 4.18, gray-matter (YAML parsing), vanilla HTML/CSS/JS, Phosphor Icons, Inter font

---

## Phase 1: Project Setup

### Task 1.1: Create folder structure

**Files:**
- Create: `projects/ejemplo-proyecto/backlog/.gitkeep`
- Create: `projects/ejemplo-proyecto/todo/.gitkeep`
- Create: `projects/ejemplo-proyecto/in-progress/.gitkeep`
- Create: `projects/ejemplo-proyecto/review/.gitkeep`
- Create: `projects/ejemplo-proyecto/done/.gitkeep`
- Create: `server/index.js`
- Create: `public/index.html`
- Create: `public/css/styles.css`
- Create: `public/js/app.js`

**Step 1: Create all directories**

```bash
mkdir -p projects/ejemplo-proyecto/{backlog,todo,in-progress,review,done}
mkdir -p server
mkdir -p public/{css,js}
```

**Step 2: Create .gitkeep files**

```bash
touch projects/ejemplo-proyecto/backlog/.gitkeep
touch projects/ejemplo-proyecto/todo/.gitkeep
touch projects/ejemplo-proyecto/in-progress/.gitkeep
touch projects/ejemplo-proyecto/review/.gitkeep
touch projects/ejemplo-proyecto/done/.gitkeep
```

**Step 3: Verify structure**

Run: `ls -R projects/`
Expected: All 5 column folders visible

**Step 4: Commit**

```bash
git add .
git commit -m "chore: create kanban folder structure"
```

---

### Task 1.2: Initialize package.json and install dependencies

**Files:**
- Create: `package.json`

**Step 1: Create package.json**

```json
{
  "name": "centro-de-mando",
  "version": "1.0.0",
  "description": "Dashboard Kanban para gestionar proyectos de Claude Code",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "node --watch server/index.js"
  },
  "keywords": ["kanban", "claude-code", "dashboard", "imascono"],
  "author": "Imascono",
  "license": "UNLICENSED",
  "dependencies": {
    "express": "^4.18.2",
    "gray-matter": "^4.0.3",
    "uuid": "^9.0.0"
  }
}
```

**Step 2: Install dependencies**

Run: `npm install`
Expected: node_modules created, package-lock.json generated

**Step 3: Add node_modules to .gitignore**

```gitignore
node_modules/
.env
*.log
```

**Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: initialize npm and install dependencies"
```

---

### Task 1.3: Create example card files

**Files:**
- Create: `projects/ejemplo-proyecto/backlog/a1b2c3d4.md`
- Create: `projects/ejemplo-proyecto/todo/b2c3d4e5.md`
- Create: `projects/ejemplo-proyecto/in-progress/c3d4e5f6.md`
- Create: `projects/ejemplo-proyecto/done/d4e5f6g7.md`

**Step 1: Create backlog card**

```markdown
---
id: "a1b2c3d4"
title: "Implementar sistema de autenticación"
description: "Crear login/logout con JWT tokens"
priority: "high"
tags: ["backend", "auth", "security"]
created: "2026-03-06T12:00:00Z"
updated: "2026-03-06T12:00:00Z"
---

## Notas

- Usar bcrypt para hash de passwords
- Tokens JWT con expiración de 1 hora
```

**Step 2: Create todo card**

```markdown
---
id: "b2c3d4e5"
title: "Diseñar componentes UI básicos"
description: "Crear botones, inputs, cards siguiendo guidelines"
priority: "medium"
tags: ["frontend", "design-system"]
created: "2026-03-06T12:30:00Z"
updated: "2026-03-06T12:30:00Z"
---

## Componentes

- [ ] Button
- [ ] Input
- [ ] Card
```

**Step 3: Create in-progress card**

```markdown
---
id: "c3d4e5f6"
title: "Configurar estructura del proyecto"
description: "Crear carpetas, instalar dependencias"
priority: "high"
tags: ["setup", "devops"]
created: "2026-03-06T10:00:00Z"
updated: "2026-03-06T14:00:00Z"
---

## Tareas

- [x] Crear estructura de carpetas
- [ ] Instalar dependencias
```

**Step 4: Create done card**

```markdown
---
id: "d4e5f6g7"
title: "Definir arquitectura del sistema"
description: "Documentar decisiones técnicas"
priority: "high"
tags: ["architecture", "documentation"]
created: "2026-03-05T09:00:00Z"
updated: "2026-03-06T11:00:00Z"
---

## Decisiones

- Frontend: HTML/CSS/JS vanilla
- Backend: Express.js
- Puerto: 9500
```

**Step 5: Commit**

```bash
git add projects/
git commit -m "chore: add example kanban cards"
```

---

## Phase 2: Backend Server

### Task 2.1: Create basic Express server

**Files:**
- Create: `server/index.js`

**Step 1: Create server file**

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = 9500;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Centro de Mando running at http://localhost:${PORT}`);
});
```

**Step 2: Test server starts**

Run: `npm start`
Expected: "Centro de Mando running at http://localhost:9500"

**Step 3: Test health endpoint**

Run: `curl http://localhost:9500/api/health`
Expected: `{"status":"ok","timestamp":"..."}`

**Step 4: Commit**

```bash
git add server/index.js
git commit -m "feat: create basic express server on port 9500"
```

---

### Task 2.2: Implement GET /api/projects

**Files:**
- Modify: `server/index.js`

**Step 1: Add fs and path imports, projects directory constant**

```javascript
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const matter = require('gray-matter');

const app = express();
const PORT = 9500;
const PROJECTS_DIR = path.join(__dirname, '../projects');
const COLUMNS = ['backlog', 'todo', 'in-progress', 'review', 'done'];
```

**Step 2: Add GET /api/projects endpoint**

```javascript
// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const slug = entry.name;
        const cardCount = {};

        for (const column of COLUMNS) {
          const columnPath = path.join(PROJECTS_DIR, slug, column);
          try {
            const files = await fs.readdir(columnPath);
            cardCount[column] = files.filter(f => f.endsWith('.md')).length;
          } catch {
            cardCount[column] = 0;
          }
        }

        projects.push({
          slug,
          name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          cardCount
        });
      }
    }

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 3: Test endpoint**

Run: `curl http://localhost:9500/api/projects`
Expected: JSON with ejemplo-proyecto and card counts

**Step 4: Commit**

```bash
git add server/index.js
git commit -m "feat: implement GET /api/projects endpoint"
```

---

### Task 2.3: Implement GET /api/projects/:slug/cards

**Files:**
- Modify: `server/index.js`

**Step 1: Add endpoint to get all cards for a project**

```javascript
// GET all cards for a project
app.get('/api/projects/:slug/cards', async (req, res) => {
  try {
    const { slug } = req.params;
    const projectPath = path.join(PROJECTS_DIR, slug);

    // Check project exists
    try {
      await fs.access(projectPath);
    } catch {
      return res.status(404).json({ error: 'Project not found' });
    }

    const cards = {};

    for (const column of COLUMNS) {
      cards[column] = [];
      const columnPath = path.join(projectPath, column);

      try {
        const files = await fs.readdir(columnPath);

        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(columnPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const { data, content: body } = matter(content);
            cards[column].push({
              ...data,
              column,
              body,
              filename: file
            });
          }
        }
      } catch {
        // Column doesn't exist, keep empty array
      }
    }

    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 2: Test endpoint**

Run: `curl http://localhost:9500/api/projects/ejemplo-proyecto/cards`
Expected: JSON with cards organized by column

**Step 3: Commit**

```bash
git add server/index.js
git commit -m "feat: implement GET /api/projects/:slug/cards endpoint"
```

---

### Task 2.4: Implement POST /api/projects/:slug/cards

**Files:**
- Modify: `server/index.js`

**Step 1: Add uuid import at top**

```javascript
const { v4: uuidv4 } = require('uuid');
```

**Step 2: Add POST endpoint**

```javascript
// POST create new card
app.post('/api/projects/:slug/cards', async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description = '', priority = 'medium', tags = [], column = 'backlog' } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!COLUMNS.includes(column)) {
      return res.status(400).json({ error: 'Invalid column' });
    }

    const id = uuidv4().slice(0, 8);
    const now = new Date().toISOString();
    const columnPath = path.join(PROJECTS_DIR, slug, column);

    // Ensure column directory exists
    await fs.mkdir(columnPath, { recursive: true });

    const cardData = {
      id,
      title,
      description,
      priority,
      tags,
      created: now,
      updated: now
    };

    const fileContent = matter.stringify('', cardData);
    const filePath = path.join(columnPath, `${id}.md`);

    await fs.writeFile(filePath, fileContent);

    res.status(201).json({ ...cardData, column });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 3: Test endpoint**

Run:
```bash
curl -X POST http://localhost:9500/api/projects/ejemplo-proyecto/cards \
  -H "Content-Type: application/json" \
  -d '{"title":"Test card","priority":"high","column":"todo"}'
```
Expected: JSON with new card data including generated id

**Step 4: Verify file created**

Run: `ls projects/ejemplo-proyecto/todo/`
Expected: New .md file visible

**Step 5: Commit**

```bash
git add server/index.js
git commit -m "feat: implement POST /api/projects/:slug/cards endpoint"
```

---

### Task 2.5: Implement POST /api/projects/:slug/cards/:id/move

**Files:**
- Modify: `server/index.js`

**Step 1: Add helper function to find card**

```javascript
// Helper: find card file across columns
async function findCardFile(projectPath, cardId) {
  for (const column of COLUMNS) {
    const columnPath = path.join(projectPath, column);
    try {
      const files = await fs.readdir(columnPath);
      const file = files.find(f => f.startsWith(cardId) && f.endsWith('.md'));
      if (file) {
        return { column, filePath: path.join(columnPath, file), filename: file };
      }
    } catch {
      // Column doesn't exist
    }
  }
  return null;
}
```

**Step 2: Add move endpoint**

```javascript
// POST move card to different column
app.post('/api/projects/:slug/cards/:id/move', async (req, res) => {
  try {
    const { slug, id } = req.params;
    const { toColumn } = req.body;

    if (!COLUMNS.includes(toColumn)) {
      return res.status(400).json({ error: 'Invalid target column' });
    }

    const projectPath = path.join(PROJECTS_DIR, slug);
    const cardInfo = await findCardFile(projectPath, id);

    if (!cardInfo) {
      return res.status(404).json({ error: 'Card not found' });
    }

    if (cardInfo.column === toColumn) {
      return res.json({ id, column: toColumn, message: 'Card already in this column' });
    }

    // Read current content
    const content = await fs.readFile(cardInfo.filePath, 'utf-8');
    const { data, content: body } = matter(content);

    // Update timestamp
    data.updated = new Date().toISOString();

    // Write to new location
    const newColumnPath = path.join(projectPath, toColumn);
    await fs.mkdir(newColumnPath, { recursive: true });
    const newFilePath = path.join(newColumnPath, cardInfo.filename);
    await fs.writeFile(newFilePath, matter.stringify(body, data));

    // Delete from old location
    await fs.unlink(cardInfo.filePath);

    res.json({ id, column: toColumn, updated: data.updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 3: Test move**

Run:
```bash
curl -X POST http://localhost:9500/api/projects/ejemplo-proyecto/cards/a1b2c3d4/move \
  -H "Content-Type: application/json" \
  -d '{"toColumn":"todo"}'
```
Expected: Card moved from backlog to todo

**Step 4: Verify file moved**

Run: `ls projects/ejemplo-proyecto/todo/`
Expected: a1b2c3d4.md now visible

**Step 5: Commit**

```bash
git add server/index.js
git commit -m "feat: implement POST /api/projects/:slug/cards/:id/move endpoint"
```

---

### Task 2.6: Implement DELETE /api/projects/:slug/cards/:id

**Files:**
- Modify: `server/index.js`

**Step 1: Add delete endpoint**

```javascript
// DELETE card
app.delete('/api/projects/:slug/cards/:id', async (req, res) => {
  try {
    const { slug, id } = req.params;
    const projectPath = path.join(PROJECTS_DIR, slug);
    const cardInfo = await findCardFile(projectPath, id);

    if (!cardInfo) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await fs.unlink(cardInfo.filePath);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 2: Test delete (create test card first)**

Run:
```bash
curl -X DELETE http://localhost:9500/api/projects/ejemplo-proyecto/cards/test-id
```
Expected: 404 for non-existent, or success for existing

**Step 3: Commit**

```bash
git add server/index.js
git commit -m "feat: implement DELETE /api/projects/:slug/cards/:id endpoint"
```

---

## Phase 3: Frontend Dashboard

### Task 3.1: Create HTML base with CSS tokens

**Files:**
- Create: `public/index.html`
- Create: `public/css/styles.css`

**Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Centro de Mando | Imascono</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header class="header">
    <div class="header__logo">
      <h1>Centro de Mando</h1>
    </div>
    <nav class="header__nav" id="projectNav"></nav>
  </header>

  <main class="main" id="main">
    <!-- Content loaded dynamically -->
  </main>

  <div class="modal" id="cardModal">
    <div class="modal__backdrop"></div>
    <div class="modal__content">
      <div class="modal__header">
        <h3 id="modalTitle">Nueva Tarjeta</h3>
        <button class="btn btn--icon" id="modalClose">
          <i class="ph ph-x"></i>
        </button>
      </div>
      <form id="cardForm" class="form">
        <input type="hidden" id="cardId">
        <input type="hidden" id="cardColumn">

        <div class="form__group">
          <label for="cardTitle">Título *</label>
          <input type="text" id="cardTitle" required>
        </div>

        <div class="form__group">
          <label for="cardDescription">Descripción</label>
          <textarea id="cardDescription" rows="3"></textarea>
        </div>

        <div class="form__row">
          <div class="form__group">
            <label for="cardPriority">Prioridad</label>
            <select id="cardPriority">
              <option value="low">Baja</option>
              <option value="medium" selected>Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>

          <div class="form__group">
            <label for="cardTags">Tags (separados por coma)</label>
            <input type="text" id="cardTags" placeholder="frontend, bug">
          </div>
        </div>

        <div class="form__actions">
          <button type="button" class="btn btn--secondary" id="cancelBtn">Cancelar</button>
          <button type="submit" class="btn btn--primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script src="/js/app.js"></script>
</body>
</html>
```

**Step 2: Create styles.css with design tokens**

```css
/* ===== DESIGN TOKENS (Imascono) ===== */
:root {
  /* Colors - Primary */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-dark: #647483;
  --color-gray-medium: #CED4D8;
  --color-gray-light: #EBF0F2;

  /* Colors - Accent */
  --color-accent-red: #F20505;
  --color-accent-pink: #F20544;
  --color-accent-magenta: #F20574;
  --color-accent-light: #F9AAAA;

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 42px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Border */
  --radius-none: 0;
  --radius-sm: 2px;

  /* Shadows */
  --shadow-subtle: 0 1px 3px rgba(0,0,0,0.05);
  --shadow-hover: 0 2px 8px rgba(0,0,0,0.08);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}

/* ===== RESET ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--color-black);
  background: var(--color-gray-light);
  min-height: 100vh;
}

/* ===== HEADER ===== */
.header {
  background: var(--color-black);
  color: var(--color-white);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.header__nav {
  display: flex;
  gap: var(--space-sm);
}

.header__nav a {
  color: var(--color-gray-medium);
  text-decoration: none;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.header__nav a:hover,
.header__nav a.active {
  color: var(--color-white);
}

/* ===== MAIN ===== */
.main {
  padding: var(--space-lg);
  max-width: 1600px;
  margin: 0 auto;
}

/* ===== DASHBOARD (Project List) ===== */
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.project-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-medium);
  padding: var(--space-lg);
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}

.project-card:hover {
  box-shadow: var(--shadow-hover);
}

.project-card h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
}

.project-card__stats {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.stat {
  font-size: var(--font-size-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-gray-light);
}

.stat--in-progress {
  background: var(--color-accent-light);
}

/* ===== KANBAN ===== */
.kanban {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-md);
  min-height: calc(100vh - 200px);
}

@media (max-width: 1200px) {
  .kanban {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .kanban {
    grid-template-columns: 1fr;
  }
}

.column {
  background: var(--color-white);
  border: 1px solid var(--color-gray-medium);
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.column__header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-gray-medium);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.column--backlog .column__header { background: var(--color-gray-light); }
.column--todo .column__header { background: var(--color-gray-light); border-left: 3px solid var(--color-gray-dark); }
.column--in-progress .column__header { background: var(--color-accent-light); border-left: 3px solid var(--color-accent-magenta); }
.column--review .column__header { background: var(--color-gray-medium); }
.column--done .column__header { background: var(--color-black); color: var(--color-white); }

.column__count {
  background: var(--color-black);
  color: var(--color-white);
  padding: 2px 8px;
  font-size: var(--font-size-xs);
}

.column--done .column__count {
  background: var(--color-white);
  color: var(--color-black);
}

.column__cards {
  flex: 1;
  padding: var(--space-sm);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.column__cards.drag-over {
  background: var(--color-gray-light);
}

.column__add {
  padding: var(--space-sm);
  border-top: 1px solid var(--color-gray-medium);
}

/* ===== CARD ===== */
.card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-medium);
  padding: var(--space-md);
  cursor: grab;
  transition: box-shadow var(--transition-fast);
}

.card:hover {
  box-shadow: var(--shadow-hover);
}

.card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.card__title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--space-xs);
}

.card__description {
  font-size: var(--font-size-xs);
  color: var(--color-gray-dark);
  margin-bottom: var(--space-sm);
}

.card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.card__priority {
  font-size: 10px;
  padding: 2px 6px;
  font-weight: 500;
  text-transform: uppercase;
}

.card__priority--low { background: var(--color-gray-light); }
.card__priority--medium { background: var(--color-gray-medium); }
.card__priority--high { background: var(--color-accent-light); color: var(--color-accent-red); }
.card__priority--critical { background: var(--color-accent-red); color: var(--color-white); }

.card__tag {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--color-gray-light);
  color: var(--color-gray-dark);
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  font-family: inherit;
  font-size: var(--font-size-sm);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn--primary {
  background: var(--color-black);
  color: var(--color-white);
}

.btn--primary:hover {
  background: var(--color-gray-dark);
}

.btn--secondary {
  background: transparent;
  border: 1px solid var(--color-black);
  color: var(--color-black);
}

.btn--secondary:hover {
  background: var(--color-gray-light);
}

.btn--icon {
  padding: var(--space-xs);
  background: transparent;
  color: var(--color-gray-dark);
}

.btn--icon:hover {
  color: var(--color-black);
}

.btn--add {
  width: 100%;
  background: var(--color-gray-light);
  color: var(--color-gray-dark);
  border: 1px dashed var(--color-gray-medium);
}

.btn--add:hover {
  background: var(--color-gray-medium);
  color: var(--color-black);
}

/* ===== MODAL ===== */
.modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.modal.open {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal__content {
  position: relative;
  background: var(--color-white);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: var(--space-md);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-gray-medium);
}

.modal__header h3 {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

/* ===== FORM ===== */
.form {
  padding: var(--space-lg);
}

.form__group {
  margin-bottom: var(--space-md);
}

.form__group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--space-xs);
}

.form__group input,
.form__group textarea,
.form__group select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-family: inherit;
  font-size: var(--font-size-base);
  border: 1px solid var(--color-gray-medium);
  background: var(--color-white);
  transition: border-color var(--transition-fast);
}

.form__group input:focus,
.form__group textarea:focus,
.form__group select:focus {
  outline: none;
  border-color: var(--color-black);
}

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-gray-medium);
}

/* ===== TOAST ===== */
.toast {
  position: fixed;
  bottom: var(--space-lg);
  right: var(--space-lg);
  background: var(--color-black);
  color: var(--color-white);
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-sm);
  transform: translateY(100px);
  opacity: 0;
  transition: all var(--transition-normal);
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.toast.error {
  background: var(--color-accent-red);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--color-gray-dark);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: var(--space-md);
}

/* ===== BACK LINK ===== */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-gray-dark);
  text-decoration: none;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-lg);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-black);
}

.project-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-lg);
}
```

**Step 3: Test HTML loads**

Run: Open http://localhost:9500 in browser
Expected: Empty page with header visible

**Step 4: Commit**

```bash
git add public/
git commit -m "feat: create HTML structure and CSS design tokens"
```

---

### Task 3.2: Create JavaScript app logic

**Files:**
- Create: `public/js/app.js`

**Step 1: Create app.js with API functions and rendering**

```javascript
// ===== STATE =====
let currentProject = null;
let projects = [];

// ===== API =====
const API = {
  async getProjects() {
    const res = await fetch('/api/projects');
    const data = await res.json();
    return data.projects;
  },

  async getCards(slug) {
    const res = await fetch(`/api/projects/${slug}/cards`);
    return res.json();
  },

  async createCard(slug, cardData) {
    const res = await fetch(`/api/projects/${slug}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData)
    });
    return res.json();
  },

  async moveCard(slug, cardId, toColumn) {
    const res = await fetch(`/api/projects/${slug}/cards/${cardId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toColumn })
    });
    return res.json();
  },

  async deleteCard(slug, cardId) {
    const res = await fetch(`/api/projects/${slug}/cards/${cardId}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// ===== TOAST =====
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== RENDER FUNCTIONS =====
function renderDashboard(projects) {
  const main = document.getElementById('main');

  if (projects.length === 0) {
    main.innerHTML = `
      <div class="empty-state">
        <i class="ph ph-folder-open"></i>
        <h2>No hay proyectos</h2>
        <p>Crea una carpeta en /projects para empezar</p>
      </div>
    `;
    return;
  }

  main.innerHTML = `
    <div class="dashboard">
      ${projects.map(p => `
        <div class="project-card" data-slug="${p.slug}">
          <h2>${p.name}</h2>
          <div class="project-card__stats">
            <span class="stat">Backlog: ${p.cardCount.backlog}</span>
            <span class="stat">Todo: ${p.cardCount.todo}</span>
            <span class="stat stat--in-progress">In Progress: ${p.cardCount['in-progress']}</span>
            <span class="stat">Review: ${p.cardCount.review}</span>
            <span class="stat">Done: ${p.cardCount.done}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Add click handlers
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      loadProject(slug);
    });
  });
}

function renderKanban(slug, cards) {
  const main = document.getElementById('main');
  const columns = ['backlog', 'todo', 'in-progress', 'review', 'done'];
  const columnNames = {
    'backlog': 'Backlog',
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'review': 'Review',
    'done': 'Done'
  };

  const project = projects.find(p => p.slug === slug);

  main.innerHTML = `
    <a href="#" class="back-link" id="backToDashboard">
      <i class="ph ph-arrow-left"></i> Volver al Dashboard
    </a>
    <h2 class="project-title">${project?.name || slug}</h2>
    <div class="kanban">
      ${columns.map(col => `
        <div class="column column--${col}" data-column="${col}">
          <div class="column__header">
            <span>${columnNames[col]}</span>
            <span class="column__count">${cards[col]?.length || 0}</span>
          </div>
          <div class="column__cards" data-column="${col}">
            ${(cards[col] || []).map(card => renderCard(card)).join('')}
          </div>
          <div class="column__add">
            <button class="btn btn--add" data-column="${col}">
              <i class="ph ph-plus"></i> Añadir tarjeta
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Back to dashboard
  document.getElementById('backToDashboard').addEventListener('click', (e) => {
    e.preventDefault();
    currentProject = null;
    loadDashboard();
  });

  // Add card buttons
  document.querySelectorAll('.btn--add').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(null, btn.dataset.column);
    });
  });

  // Card click handlers
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      // Could open edit modal here
    });
  });

  // Setup drag and drop
  setupDragAndDrop();
}

function renderCard(card) {
  return `
    <div class="card" draggable="true" data-id="${card.id}">
      <div class="card__title">${card.title}</div>
      ${card.description ? `<div class="card__description">${card.description}</div>` : ''}
      <div class="card__meta">
        <span class="card__priority card__priority--${card.priority}">${card.priority}</span>
        ${(card.tags || []).map(tag => `<span class="card__tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;
}

// ===== DRAG AND DROP =====
function setupDragAndDrop() {
  const cards = document.querySelectorAll('.card');
  const columns = document.querySelectorAll('.column__cards');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.dataset.id);
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      columns.forEach(col => col.classList.remove('drag-over'));
    });
  });

  columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => {
      column.classList.remove('drag-over');
    });

    column.addEventListener('drop', async (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');

      const cardId = e.dataTransfer.getData('text/plain');
      const toColumn = column.dataset.column;

      try {
        await API.moveCard(currentProject, cardId, toColumn);
        showToast('Tarjeta movida');
        loadProject(currentProject);
      } catch (err) {
        showToast('Error al mover tarjeta', true);
      }
    });
  });
}

// ===== MODAL =====
const modal = document.getElementById('cardModal');
const form = document.getElementById('cardForm');

function openModal(card = null, column = 'backlog') {
  document.getElementById('modalTitle').textContent = card ? 'Editar Tarjeta' : 'Nueva Tarjeta';
  document.getElementById('cardId').value = card?.id || '';
  document.getElementById('cardColumn').value = column;
  document.getElementById('cardTitle').value = card?.title || '';
  document.getElementById('cardDescription').value = card?.description || '';
  document.getElementById('cardPriority').value = card?.priority || 'medium';
  document.getElementById('cardTags').value = (card?.tags || []).join(', ');
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
  form.reset();
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.querySelector('.modal__backdrop').addEventListener('click', closeModal);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cardData = {
    title: document.getElementById('cardTitle').value,
    description: document.getElementById('cardDescription').value,
    priority: document.getElementById('cardPriority').value,
    tags: document.getElementById('cardTags').value.split(',').map(t => t.trim()).filter(Boolean),
    column: document.getElementById('cardColumn').value
  };

  try {
    await API.createCard(currentProject, cardData);
    showToast('Tarjeta creada');
    closeModal();
    loadProject(currentProject);
  } catch (err) {
    showToast('Error al crear tarjeta', true);
  }
});

// ===== NAVIGATION =====
async function loadDashboard() {
  try {
    projects = await API.getProjects();
    renderDashboard(projects);
    updateNav();
  } catch (err) {
    showToast('Error al cargar proyectos', true);
  }
}

async function loadProject(slug) {
  try {
    currentProject = slug;
    const cards = await API.getCards(slug);
    renderKanban(slug, cards);
    updateNav();
  } catch (err) {
    showToast('Error al cargar proyecto', true);
  }
}

function updateNav() {
  const nav = document.getElementById('projectNav');
  nav.innerHTML = projects.map(p => `
    <a href="#" data-slug="${p.slug}" class="${p.slug === currentProject ? 'active' : ''}">${p.name}</a>
  `).join('');

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      loadProject(link.dataset.slug);
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', loadDashboard);
```

**Step 2: Test full application**

Run: Open http://localhost:9500
Expected: Dashboard shows example project, clicking opens Kanban with drag & drop

**Step 3: Commit**

```bash
git add public/js/app.js
git commit -m "feat: implement frontend JavaScript with API integration"
```

---

## Phase 4: Skill for Claude Code Integration

### Task 4.1: Create dashboard skill

**Files:**
- Create: `.claude/skills/dashboard.md`

**Step 1: Create skills directory**

```bash
mkdir -p .claude/skills
```

**Step 2: Create dashboard.md skill**

```markdown
# Dashboard Skill

Use this skill to interact with the Centro de Mando Kanban dashboard.

## Setup

The Centro de Mando should be running at http://localhost:9500

## Read Cards

To get all cards for a project:

```bash
curl -s http://localhost:9500/api/projects/{PROJECT_SLUG}/cards | jq
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
```

**Step 3: Commit**

```bash
git add .claude/
git commit -m "feat: add dashboard skill for Claude Code integration"
```

---

### Task 4.2: Create instructions for other projects

**Files:**
- Create: `INTEGRATION.md`

**Step 1: Create integration guide**

```markdown
# Integración con Centro de Mando

## Configuración

1. El Centro de Mando debe estar corriendo en `localhost:9500`
2. Tu proyecto debe tener una carpeta en `projects/{tu-proyecto-slug}/`

## Añadir a tu CLAUDE.md

Añade esta sección a tu CLAUDE.md:

```markdown
## Centro de Mando Integration

Este proyecto está conectado al Centro de Mando en:
`C:\Users\Sergio - Imascono\Documents\Escritor de Memorias Técnicas\Centro de Mando Desarrollo`

### Leer tareas actuales

Al inicio de sesión, consulta las tareas del proyecto:

```bash
curl -s http://localhost:9500/api/projects/{SLUG}/cards | jq '.["in-progress"], .todo'
```

### Actualizar estado de tarea

Cuando completes una tarea, muévela:

```bash
curl -s -X POST http://localhost:9500/api/projects/{SLUG}/cards/{ID}/move \
  -H "Content-Type: application/json" \
  -d '{"toColumn": "done"}'
```
```

## Crear nuevo proyecto

1. Crea la carpeta: `mkdir -p projects/{tu-slug}/{backlog,todo,in-progress,review,done}`
2. El proyecto aparecerá automáticamente en el dashboard
```

**Step 2: Commit**

```bash
git add INTEGRATION.md
git commit -m "docs: add integration guide for other projects"
```

---

## Phase 5: Final Setup

### Task 5.1: Update progress.txt

**Files:**
- Modify: `progress.txt`

**Step 1: Update progress file**

```markdown
# progress.txt

## Last Updated
2026-03-06

## Current Step
Implementation complete - Phase 5

## Completed
- [x] Documentation (PRD, TECH_STACK, etc.)
- [x] Folder structure for Kanban
- [x] Backend API (Express + gray-matter)
- [x] Frontend dashboard (HTML/CSS/JS vanilla)
- [x] Drag & drop between columns
- [x] Create/edit cards modal
- [x] Skill for Claude Code integration
- [x] Integration documentation

## In Progress
- [ ] Testing full flow

## Next Up
- [ ] Add more projects
- [ ] Polish and refinements

## Notes
Server runs on port 9500. Start with `npm start`.
```

**Step 2: Commit**

```bash
git add progress.txt
git commit -m "docs: update progress tracking"
```

---

### Task 5.2: Create README

**Files:**
- Create: `README.md`

**Step 1: Create README**

```markdown
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
title: "Título"
description: "Descripción"
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

## Integración

Ver `INTEGRATION.md` para conectar otros proyectos.
```

**Step 2: Final commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1.1-1.3 | Setup: folders, npm, example cards |
| 2 | 2.1-2.6 | Backend: Express API endpoints |
| 3 | 3.1-3.2 | Frontend: HTML/CSS/JS Kanban |
| 4 | 4.1-4.2 | Skill and integration docs |
| 5 | 5.1-5.2 | Progress tracking and README |

**Total tasks:** 13
**Estimated commits:** 13
