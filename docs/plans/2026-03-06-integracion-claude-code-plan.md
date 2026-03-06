# Integración Centro de Mando con Claude Code - Plan de Implementación

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Permitir que Claude Code gestione tarjetas del Centro de Mando automáticamente con campos IA y movimiento de tarjetas.

**Architecture:** API REST extendida + Skill centralizado copiable a proyectos cliente + configuración interactiva.

**Tech Stack:** Node.js/Express (API), Markdown (Skills), JSON (Config)

---

## Task 1: Extender API - Filtrado por columna

**Files:**
- Modify: `server/index.js:127-171`

**Step 1: Modificar endpoint GET /api/projects/:slug/cards**

Añadir soporte para query param `?column=in-progress`:

```javascript
// GET all cards for a project (with optional column filter)
app.get('/api/projects/:slug/cards', async (req, res) => {
  try {
    const { slug } = req.params;
    const { column: filterColumn } = req.query;
    const projectPath = path.join(PROJECTS_DIR, slug);

    try {
      await fs.access(projectPath);
    } catch {
      return res.status(404).json({ error: 'Project not found' });
    }

    const cards = [];
    const columnsToScan = filterColumn && COLUMNS.includes(filterColumn)
      ? [filterColumn]
      : COLUMNS;

    for (const column of columnsToScan) {
      const columnPath = path.join(projectPath, column);

      try {
        const files = await fs.readdir(columnPath);
        let position = 0;

        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(columnPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const { data, content: body } = matter(content);
            cards.push({
              ...data,
              column,
              position,
              body,
              filename: file
            });
            position++;
          }
        }
      } catch {
        // Column doesn't exist, skip
      }
    }

    res.json({ cards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 2: Probar el endpoint**

```bash
# Todas las tarjetas
curl -s http://localhost:9500/api/projects/factoria-de-ventas/cards | jq '.cards | length'

# Solo in-progress
curl -s "http://localhost:9500/api/projects/factoria-de-ventas/cards?column=in-progress" | jq '.cards'

# Solo backlog
curl -s "http://localhost:9500/api/projects/factoria-de-ventas/cards?column=backlog" | jq '.cards | length'
```

**Step 3: Commit**

```bash
git add server/index.js
git commit -m "feat(api): añadir filtrado de tarjetas por columna"
```

---

## Task 2: Extender API - Endpoint GET /next

**Files:**
- Modify: `server/index.js` (añadir después de GET cards)

**Step 1: Añadir endpoint para siguiente tarjeta sugerida**

```javascript
// GET next suggested card from backlog
app.get('/api/projects/:slug/cards/next', async (req, res) => {
  try {
    const { slug } = req.params;
    const projectPath = path.join(PROJECTS_DIR, slug);
    const backlogPath = path.join(projectPath, 'backlog');

    try {
      await fs.access(projectPath);
    } catch {
      return res.status(404).json({ error: 'Project not found' });
    }

    const cards = [];

    try {
      const files = await fs.readdir(backlogPath);

      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(backlogPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const { data } = matter(content);
          cards.push({ ...data, filename: file });
        }
      }
    } catch {
      return res.json({ card: null, message: 'No cards in backlog' });
    }

    if (cards.length === 0) {
      return res.json({ card: null, message: 'No cards in backlog' });
    }

    // Sort by priority (critical > high > medium > low) then by created date
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    cards.sort((a, b) => {
      const pA = priorityOrder[a.priority] ?? 2;
      const pB = priorityOrder[b.priority] ?? 2;
      if (pA !== pB) return pA - pB;
      return new Date(a.created) - new Date(b.created);
    });

    res.json({ card: cards[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 2: Probar el endpoint**

```bash
curl -s http://localhost:9500/api/projects/factoria-de-ventas/cards/next | jq
```

Expected: La tarjeta de mayor prioridad del backlog.

**Step 3: Commit**

```bash
git add server/index.js
git commit -m "feat(api): añadir endpoint /cards/next para siguiente tarjeta sugerida"
```

---

## Task 3: Extender API - PATCH para campos IA

**Files:**
- Modify: `server/index.js` (añadir después de PUT update card)

**Step 1: Añadir endpoint PATCH para actualizar campos IA**

```javascript
// PATCH update AI fields on card
app.patch('/api/projects/:slug/cards/:id', async (req, res) => {
  try {
    const { slug, id } = req.params;
    const { ai_description, acceptance_criteria, linked_plan } = req.body;

    const projectPath = path.join(PROJECTS_DIR, slug);
    const cardInfo = await findCardFile(projectPath, id);

    if (!cardInfo) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const content = await fs.readFile(cardInfo.filePath, 'utf-8');
    const { data, content: body } = matter(content);

    // Update AI fields only if provided
    if (ai_description !== undefined) data.ai_description = ai_description;
    if (acceptance_criteria !== undefined) data.acceptance_criteria = acceptance_criteria;
    if (linked_plan !== undefined) data.linked_plan = linked_plan;
    data.updated = new Date().toISOString();

    await fs.writeFile(cardInfo.filePath, matter.stringify(body, data));

    res.json({ ...data, id, column: cardInfo.column });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 2: Probar el endpoint**

```bash
# Obtener un ID de tarjeta existente
CARD_ID=$(curl -s http://localhost:9500/api/projects/factoria-de-ventas/cards | jq -r '.cards[0].id')

# Actualizar campos IA
curl -s -X PATCH "http://localhost:9500/api/projects/factoria-de-ventas/cards/$CARD_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "ai_description": "Esta tarea implica implementar...",
    "acceptance_criteria": ["Criterio 1", "Criterio 2", "Criterio 3"],
    "linked_plan": "docs/plans/2026-03-06-feature.md"
  }' | jq
```

**Step 3: Verificar que se guardó**

```bash
curl -s http://localhost:9500/api/projects/factoria-de-ventas/cards | jq ".cards[] | select(.id==\"$CARD_ID\")"
```

**Step 4: Commit**

```bash
git add server/index.js
git commit -m "feat(api): añadir PATCH para campos IA (ai_description, acceptance_criteria, linked_plan)"
```

---

## Task 4: Extender POST /cards para campos IA

**Files:**
- Modify: `server/index.js:173-212`

**Step 1: Modificar endpoint POST para aceptar campos IA**

```javascript
// POST create new card (with optional AI fields)
app.post('/api/projects/:slug/cards', async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title,
      description = '',
      priority = 'medium',
      tags = [],
      column = 'backlog',
      // New AI fields
      ai_description = null,
      acceptance_criteria = [],
      linked_plan = null
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!COLUMNS.includes(column)) {
      return res.status(400).json({ error: 'Invalid column' });
    }

    const id = uuidv4().slice(0, 8);
    const now = new Date().toISOString();
    const columnPath = path.join(PROJECTS_DIR, slug, column);

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

    // Add AI fields only if provided
    if (ai_description) cardData.ai_description = ai_description;
    if (acceptance_criteria.length > 0) cardData.acceptance_criteria = acceptance_criteria;
    if (linked_plan) cardData.linked_plan = linked_plan;

    const fileContent = matter.stringify('', cardData);
    const filePath = path.join(columnPath, `${id}.md`);

    await fs.writeFile(filePath, fileContent);

    res.status(201).json({ ...cardData, column });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Step 2: Probar creación con campos IA**

```bash
curl -s -X POST http://localhost:9500/api/projects/factoria-de-ventas/cards \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea de prueba con IA",
    "description": "Descripción corta",
    "priority": "high",
    "ai_description": "Esta es una descripción expandida por IA con más contexto y detalles técnicos.",
    "acceptance_criteria": ["El usuario puede hacer X", "El sistema valida Y", "Tests pasan"]
  }' | jq
```

**Step 3: Commit**

```bash
git add server/index.js
git commit -m "feat(api): soportar campos IA en POST /cards"
```

---

## Task 5: Crear Skill centro-de-mando.md

**Files:**
- Create: `.claude/skills/centro-de-mando.md`

**Step 1: Crear el skill principal**

```markdown
# Centro de Mando - Skill de Integración

Gestiona tarjetas del Centro de Mando Kanban desde Claude Code.

## Configuración

El skill busca configuración en `.claude/centro-de-mando.json`:

```json
{
  "enabled": true,
  "server": "http://localhost:9500",
  "project": "nombre-proyecto",
  "auto_move": true,
  "auto_analyze": true
}
```

## Comandos

### /task
Lista tarjetas del backlog y permite seleccionar una para trabajar.

**Comportamiento:**
1. Si no hay config, ejecuta configuración interactiva
2. Muestra tarjetas en backlog ordenadas por prioridad
3. Al seleccionar, mueve a `in-progress`
4. Si `auto_analyze: true`, genera `ai_description` y `acceptance_criteria`

**Ejemplo:**
```
> /task

📋 Backlog de factoria-de-ventas (5 tarjetas)

1. [HIGH] Implementar OAuth - "Añadir login con Google"
2. [HIGH] Validar emails - "Verificar formato de email"
3. [MEDIUM] Refactor API - "Limpiar endpoints legacy"

¿Cuál quieres tomar? (1-3 o 'q' para salir): _
```

### /task new <título>
Crea una nueva tarjeta en backlog.

**Comportamiento:**
1. Pide descripción breve
2. Genera `ai_description` expandiendo contexto del proyecto
3. Genera `acceptance_criteria` (3-5 criterios verificables)
4. Sugiere `priority` basada en análisis
5. Guarda en backlog

**API Call:**
```bash
curl -X POST $SERVER/api/projects/$PROJECT/cards \
  -H "Content-Type: application/json" \
  -d '{
    "title": "<título>",
    "description": "<descripción del usuario>",
    "priority": "<sugerida por IA>",
    "ai_description": "<generada>",
    "acceptance_criteria": ["<generados>"]
  }'
```

### /task new-and-start <título>
Crea tarjeta y la toma inmediatamente.

**Comportamiento:**
1. Ejecuta `/task new`
2. Mueve tarjeta a `in-progress`
3. Invoca `superpowers:brainstorming` si es tarea compleja

### /task done
Marca la tarea actual como completada.

**Comportamiento:**
1. Verifica que hay tarea en progreso
2. Mueve de `in-progress` → `review`
3. Actualiza campo `updated`

**API Call:**
```bash
curl -X PUT $SERVER/api/projects/$PROJECT/cards/$CARD_ID/move \
  -H "Content-Type: application/json" \
  -d '{"column": "review"}'
```

### /task verify
Verifica criterios de aceptación.

**Comportamiento:**
1. Lee `acceptance_criteria` de la tarjeta en `review`
2. Para cada criterio, verifica si se cumple
3. Si todos OK: mueve `review` → `done`
4. Si falla alguno: reporta cuáles faltan

### /task status
Muestra estado de la tarjeta actual.

**Output:**
```
📋 Tarea actual: Implementar OAuth
📍 Columna: in-progress
⏱️  Iniciada: hace 2 horas

Criterios de aceptación:
✅ Usuario puede hacer login con Google
⬜ Usuario puede hacer login con Microsoft
⬜ Tests e2e cubren ambos flujos
```

### /task link-plan <ruta>
Vincula un plan a la tarjeta actual.

**API Call:**
```bash
curl -X PATCH $SERVER/api/projects/$PROJECT/cards/$CARD_ID \
  -H "Content-Type: application/json" \
  -d '{"linked_plan": "<ruta>"}'
```

### /task config
Reconfigura el proyecto vinculado.

**Comportamiento:**
1. Consulta API para listar proyectos disponibles
2. Muestra selector interactivo
3. Guarda en `.claude/centro-de-mando.json`

## Configuración Interactiva (Primera Ejecución)

Si no existe `.claude/centro-de-mando.json`:

```
🔧 Configuración Centro de Mando
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Servidor: http://localhost:9500 ✓

Proyectos disponibles:
1. factoria-de-ventas
2. factoria-de-licitaciones
3. [Crear nuevo proyecto]

¿Con cuál trabajas? _
```

**API para listar proyectos:**
```bash
curl -s http://localhost:9500/api/projects | jq '.projects[].slug'
```

## Flujo de Trabajo Recomendado

```
1. /task              → Seleccionar tarjeta del backlog
                        → Se mueve a in-progress
                        → Se analizan criterios

2. Trabajar           → Implementar la funcionalidad
                        → Usar superpowers si es complejo

3. /task done         → Marcar completada
                        → Se mueve a review

4. /task verify       → Verificar criterios
                        → Si OK, se mueve a done
```

## Integración con Superpowers

- Al tomar tarjeta compleja: `superpowers:brainstorming`
- Antes de /task done: `superpowers:verification-before-completion`
- Si se crea plan: actualizar `linked_plan`

## Estado Interno

El skill mantiene estado de la tarjeta actual en memoria:
- `currentCard`: ID de la tarjeta en progreso
- `project`: Proyecto configurado
- `server`: URL del servidor

Este estado se pierde al cerrar la sesión. Al reiniciar, el skill
detecta tarjetas en `in-progress` y pregunta si continuar.
```

**Step 2: Commit**

```bash
git add .claude/skills/centro-de-mando.md
git commit -m "feat: crear skill centro-de-mando.md para integración Claude Code"
```

---

## Task 6: Crear README-INTEGRACION.md

**Files:**
- Create: `README-INTEGRACION.md`

**Step 1: Crear documentación de integración**

```markdown
# Integración Centro de Mando con Claude Code

Permite gestionar tarjetas del Centro de Mando desde cualquier proyecto con Claude Code.

## Requisitos

- Centro de Mando corriendo en `http://localhost:9500`
- Claude Code con plugin superpowers instalado
- Proyecto creado en Centro de Mando

## Instalación Rápida (1 minuto)

### 1. Copiar el skill a tu proyecto

```bash
# Desde tu proyecto
mkdir -p .claude/skills

# Copiar skill (ajusta la ruta)
cp "C:\Users\...\Centro de Mando Desarrollo\.claude\skills\centro-de-mando.md" .claude/skills/
```

### 2. Usar el skill

```
> /task
```

La primera vez te pedirá configurar el proyecto:

```
🔧 Configuración Centro de Mando
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Servidor: http://localhost:9500 ✓

Proyectos disponibles:
1. factoria-de-ventas
2. factoria-de-licitaciones
3. [Crear nuevo proyecto]

¿Con cuál trabajas? _
```

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `/task` | Ver y seleccionar tarjeta del backlog |
| `/task new <título>` | Crear nueva tarjeta con análisis IA |
| `/task new-and-start <título>` | Crear y empezar a trabajar |
| `/task done` | Marcar tarea completada → review |
| `/task verify` | Verificar criterios → done |
| `/task status` | Ver estado de tarjeta actual |
| `/task link-plan <ruta>` | Vincular plan a tarjeta |
| `/task config` | Cambiar proyecto vinculado |

## Flujo de Trabajo Recomendado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   BACKLOG   │ ──► │ IN-PROGRESS │ ──► │   REVIEW    │ ──► │    DONE     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │
   /task              trabajar            /task done         /task verify
   (seleccionar)      (implementar)       (completar)        (verificar)
```

## Campos IA en Tarjetas

Al crear o tomar una tarjeta, Claude genera automáticamente:

- **ai_description**: Descripción expandida con contexto técnico
- **acceptance_criteria**: Lista de criterios verificables (3-5)
- **linked_plan**: Referencia a plan de implementación (si existe)

## Ejemplo de Sesión

```
> /task

📋 Backlog de factoria-de-ventas (3 tarjetas)

1. [HIGH] Implementar OAuth
2. [MEDIUM] Validar emails
3. [LOW] Actualizar docs

¿Cuál quieres tomar? 1

✓ Tomando "Implementar OAuth"
✓ Moviendo a in-progress
✓ Generando análisis IA...

📋 Tarea: Implementar OAuth
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Descripción IA:
Esta tarea implica integrar OAuth 2.0 para autenticación
federada con Google y Microsoft...

Criterios de aceptación:
1. Usuario puede hacer login con Google
2. Usuario puede hacer login con Microsoft
3. Tokens se almacenan de forma segura
4. Tests e2e cubren ambos flujos

¿Comenzamos con brainstorming? (s/n)
```

## Configuración Manual

Si prefieres configurar manualmente, crea `.claude/centro-de-mando.json`:

```json
{
  "enabled": true,
  "server": "http://localhost:9500",
  "project": "tu-proyecto",
  "auto_move": true,
  "auto_analyze": true
}
```

## Troubleshooting

### El servidor no responde

```bash
# Verificar que está corriendo
curl http://localhost:9500/api/health

# Si no responde, iniciarlo
cd "C:\...\Centro de Mando Desarrollo"
node server/index.js
```

### El proyecto no aparece en la lista

```bash
# Crear proyecto manualmente
curl -X POST http://localhost:9500/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "mi-proyecto"}'
```

### Resetear configuración

```bash
# Eliminar config para reconfigurar
rm .claude/centro-de-mando.json
```

## API Reference

El skill usa estos endpoints:

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/api/projects` | Listar proyectos |
| GET | `/api/projects/:slug/cards` | Obtener tarjetas |
| GET | `/api/projects/:slug/cards?column=X` | Filtrar por columna |
| GET | `/api/projects/:slug/cards/next` | Siguiente sugerida |
| POST | `/api/projects/:slug/cards` | Crear tarjeta |
| PUT | `/api/projects/:slug/cards/:id/move` | Mover tarjeta |
| PATCH | `/api/projects/:slug/cards/:id` | Actualizar campos IA |
```

**Step 2: Commit**

```bash
git add README-INTEGRACION.md
git commit -m "docs: añadir README-INTEGRACION.md con guía de instalación"
```

---

## Task 7: Actualizar UI - Mostrar campos IA

**Files:**
- Modify: `public/js/app.js`
- Modify: `public/css/styles.css`

**Step 1: Añadir estilos para campos IA**

En `public/css/styles.css`, añadir al final:

```css
/* ============================================
   AI FIELDS IN CARDS
   ============================================ */

.card__ai-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 2px var(--space-sm);
  background-color: var(--color-accent-magenta);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.card__ai-description {
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  background-color: var(--color-surface);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  border-left: 2px solid var(--color-accent-magenta);
}

.card__acceptance-criteria {
  margin-top: var(--space-sm);
  padding-left: var(--space-md);
}

.card__acceptance-criteria li {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
  list-style: none;
  position: relative;
  padding-left: var(--space-md);
}

.card__acceptance-criteria li::before {
  content: '☐';
  position: absolute;
  left: 0;
}

.card__linked-plan {
  margin-top: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--color-accent-magenta);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

/* Modal AI fields */
.modal__ai-section {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.modal__ai-section h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-magenta);
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}
```

**Step 2: Commit estilos**

```bash
git add public/css/styles.css
git commit -m "style: añadir estilos para campos IA en tarjetas"
```

---

## Task 8: Push final y verificación

**Step 1: Push todos los cambios**

```bash
git push
```

**Step 2: Verificar endpoints nuevos**

```bash
# Test filtrado por columna
curl -s "http://localhost:9500/api/projects/factoria-de-ventas/cards?column=backlog" | jq '.cards | length'

# Test /next
curl -s http://localhost:9500/api/projects/factoria-de-ventas/cards/next | jq

# Test PATCH
CARD_ID=$(curl -s http://localhost:9500/api/projects/factoria-de-ventas/cards | jq -r '.cards[0].id')
curl -s -X PATCH "http://localhost:9500/api/projects/factoria-de-ventas/cards/$CARD_ID" \
  -H "Content-Type: application/json" \
  -d '{"acceptance_criteria": ["Test 1", "Test 2"]}' | jq
```

**Step 3: Verificar que skill existe**

```bash
cat .claude/skills/centro-de-mando.md | head -20
```

**Step 4: Verificar documentación**

```bash
cat README-INTEGRACION.md | head -30
```

---

## Resumen de Archivos

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `server/index.js` | Modificar | Añadir endpoints: filtro columna, /next, PATCH |
| `.claude/skills/centro-de-mando.md` | Crear | Skill principal con todos los comandos |
| `README-INTEGRACION.md` | Crear | Documentación de integración |
| `public/css/styles.css` | Modificar | Estilos para campos IA |

---

## Criterios de Aceptación

- [x] GET /cards acepta ?column= para filtrar
- [x] GET /cards/next devuelve tarjeta de mayor prioridad
- [x] PATCH /cards/:id actualiza campos IA
- [x] POST /cards acepta campos IA opcionales
- [x] Skill centro-de-mando.md creado con todos los comandos
- [x] README-INTEGRACION.md con guía completa
- [x] Estilos CSS para mostrar campos IA

---

*Plan creado: 2026-03-06*
