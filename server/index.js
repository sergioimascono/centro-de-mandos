const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const matter = require('gray-matter');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 9500;
const PROJECTS_DIR = path.join(__dirname, '../projects');
const ARCHIVED_DIR = path.join(__dirname, '../archived');
const COLUMNS = ['backlog', 'todo', 'in-progress', 'review', 'done'];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

// POST create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (!slug) {
      return res.status(400).json({ error: 'Invalid project name' });
    }

    const projectPath = path.join(PROJECTS_DIR, slug);

    // Check if already exists
    try {
      await fs.access(projectPath);
      return res.status(409).json({ error: 'Project already exists' });
    } catch {
      // Good - doesn't exist
    }

    // Create project folder with all columns
    for (const column of COLUMNS) {
      await fs.mkdir(path.join(projectPath, column), { recursive: true });
    }

    res.status(201).json({
      slug,
      name: name.trim(),
      cardCount: { backlog: 0, todo: 0, 'in-progress': 0, review: 0, done: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single project
app.get('/api/projects/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const projectPath = path.join(PROJECTS_DIR, slug);

    try {
      await fs.access(projectPath);
    } catch {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = {
      slug,
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    };

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// PUT update card
app.put('/api/projects/:slug/cards/:id', async (req, res) => {
  try {
    const { slug, id } = req.params;
    const { title, description, priority, tags, column } = req.body;

    const projectPath = path.join(PROJECTS_DIR, slug);
    const cardInfo = await findCardFile(projectPath, id);

    if (!cardInfo) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const content = await fs.readFile(cardInfo.filePath, 'utf-8');
    const { data, content: body } = matter(content);

    // Update fields
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;
    if (tags !== undefined) data.tags = tags;
    data.updated = new Date().toISOString();

    // If column changed, move the file
    if (column && column !== cardInfo.column && COLUMNS.includes(column)) {
      const newColumnPath = path.join(projectPath, column);
      await fs.mkdir(newColumnPath, { recursive: true });
      const newFilePath = path.join(newColumnPath, cardInfo.filename);
      await fs.writeFile(newFilePath, matter.stringify(body, data));
      await fs.unlink(cardInfo.filePath);

      res.json({ ...data, id, column });
    } else {
      await fs.writeFile(cardInfo.filePath, matter.stringify(body, data));
      res.json({ ...data, id, column: cardInfo.column });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// PUT move card to different column
app.put('/api/projects/:slug/cards/:id/move', async (req, res) => {
  try {
    const { slug, id } = req.params;
    const { column: toColumn, position } = req.body;

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

    const content = await fs.readFile(cardInfo.filePath, 'utf-8');
    const { data, content: body } = matter(content);

    data.updated = new Date().toISOString();

    const newColumnPath = path.join(projectPath, toColumn);
    await fs.mkdir(newColumnPath, { recursive: true });
    const newFilePath = path.join(newColumnPath, cardInfo.filename);
    await fs.writeFile(newFilePath, matter.stringify(body, data));

    await fs.unlink(cardInfo.filePath);

    res.json({ id, column: toColumn, updated: data.updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST archive project
app.post('/api/projects/:slug/archive', async (req, res) => {
  try {
    const { slug } = req.params;
    const projectPath = path.join(PROJECTS_DIR, slug);
    const archivedPath = path.join(ARCHIVED_DIR, slug);

    // Check if project exists
    try {
      await fs.access(projectPath);
    } catch {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create archived directory if needed
    await fs.mkdir(ARCHIVED_DIR, { recursive: true });

    // Check if already archived
    try {
      await fs.access(archivedPath);
      return res.status(409).json({ error: 'Project already archived with this name' });
    } catch {
      // Good - doesn't exist in archived
    }

    // Move project to archived
    await fs.rename(projectPath, archivedPath);

    res.json({ success: true, slug, message: 'Project archived' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET archived projects
app.get('/api/archived', async (req, res) => {
  try {
    // Create archived directory if needed
    await fs.mkdir(ARCHIVED_DIR, { recursive: true });

    const entries = await fs.readdir(ARCHIVED_DIR, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const slug = entry.name;
        const cardCount = {};

        for (const column of COLUMNS) {
          const columnPath = path.join(ARCHIVED_DIR, slug, column);
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
          cardCount,
          archived: true
        });
      }
    }

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST restore archived project
app.post('/api/archived/:slug/restore', async (req, res) => {
  try {
    const { slug } = req.params;
    const archivedPath = path.join(ARCHIVED_DIR, slug);
    const projectPath = path.join(PROJECTS_DIR, slug);

    // Check if archived project exists
    try {
      await fs.access(archivedPath);
    } catch {
      return res.status(404).json({ error: 'Archived project not found' });
    }

    // Check if active project with same name exists
    try {
      await fs.access(projectPath);
      return res.status(409).json({ error: 'Active project with this name already exists' });
    } catch {
      // Good - doesn't exist in projects
    }

    // Move project back to projects
    await fs.rename(archivedPath, projectPath);

    res.json({ success: true, slug, message: 'Project restored' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Start server
app.listen(PORT, () => {
  console.log(`Centro de Mando running at http://localhost:${PORT}`);
});
