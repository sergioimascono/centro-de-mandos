/**
 * Centro de Mando - Kanban Dashboard
 * Imascono Development
 */

// ============================================
// API LAYER
// ============================================

const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la solicitud');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Projects
  async getProjects() {
    return this.request('/projects');
  },

  async getProject(slug) {
    return this.request(`/projects/${slug}`);
  },

  async createProject(name) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async archiveProject(slug) {
    return this.request(`/projects/${slug}/archive`, {
      method: 'POST',
    });
  },

  async getArchivedProjects() {
    return this.request('/archived');
  },

  async restoreProject(slug) {
    return this.request(`/archived/${slug}/restore`, {
      method: 'POST',
    });
  },

  // Cards
  async getCards(projectSlug) {
    return this.request(`/projects/${projectSlug}/cards`);
  },

  async createCard(projectSlug, cardData) {
    return this.request(`/projects/${projectSlug}/cards`, {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  },

  async updateCard(projectSlug, cardId, cardData) {
    return this.request(`/projects/${projectSlug}/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  },

  async moveCard(projectSlug, cardId, newColumn, newPosition) {
    return this.request(`/projects/${projectSlug}/cards/${cardId}/move`, {
      method: 'PUT',
      body: JSON.stringify({ column: newColumn, position: newPosition }),
    });
  },

  async deleteCard(projectSlug, cardId) {
    return this.request(`/projects/${projectSlug}/cards/${cardId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// STATE MANAGEMENT
// ============================================

const State = {
  currentProject: null,
  projects: [],
  archivedProjects: [],
  cards: [],
  showArchived: false,

  setProjects(projects) {
    this.projects = projects;
  },

  setArchivedProjects(projects) {
    this.archivedProjects = projects;
  },

  toggleShowArchived() {
    this.showArchived = !this.showArchived;
  },

  setCurrentProject(project) {
    this.currentProject = project;
  },

  setCards(cards) {
    this.cards = cards;
  },

  getCardsByColumn(column) {
    return this.cards
      .filter(card => card.column === column)
      .sort((a, b) => a.position - b.position);
  },

  getProjectStats(project) {
    if (!project.cards) return { total: 0, done: 0 };
    const total = project.cards.length;
    const done = project.cards.filter(c => c.column === 'done').length;
    return { total, done };
  },
};

// ============================================
// COLUMN DEFINITIONS
// ============================================

const COLUMNS = [
  { id: 'backlog', name: 'Backlog', icon: 'ph-stack' },
  { id: 'todo', name: 'Por Hacer', icon: 'ph-list-checks' },
  { id: 'in-progress', name: 'En Progreso', icon: 'ph-lightning' },
  { id: 'review', name: 'Revision', icon: 'ph-eye' },
  { id: 'done', name: 'Completado', icon: 'ph-check-circle' },
];

// ============================================
// RENDERING
// ============================================

function renderDashboard() {
  const main = document.getElementById('main');

  const newProjectCard = `
    <div class="project-card project-card--new" onclick="openProjectModal()">
      <div class="project-card__new-icon">
        <i class="ph ph-plus"></i>
      </div>
      <h3 class="project-card__name">Nuevo Proyecto</h3>
      <p class="project-card__description">Crear un nuevo tablero Kanban</p>
    </div>
  `;

  const projectCards = State.projects.map(project => {
    const stats = State.getProjectStats(project);
    return `
      <div class="project-card" data-slug="${project.slug}">
        <button class="project-card__archive" onclick="event.stopPropagation(); archiveProject('${project.slug}')" title="Archivar proyecto">
          <i class="ph ph-archive"></i>
        </button>
        <div class="project-card__content" onclick="loadProject('${project.slug}')">
          <h3 class="project-card__name">${project.name}</h3>
          <p class="project-card__description">${project.description || 'Sin descripcion'}</p>
          <div class="project-card__stats">
            <span class="project-card__stat">
              <i class="ph ph-cards"></i>
              ${stats.total} tarjetas
            </span>
            <span class="project-card__stat">
              <i class="ph ph-check-circle"></i>
              ${stats.done} completadas
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const archivedCards = State.archivedProjects.map(project => {
    const stats = State.getProjectStats(project);
    return `
      <div class="project-card project-card--archived" data-slug="${project.slug}">
        <button class="project-card__restore" onclick="event.stopPropagation(); restoreProject('${project.slug}')" title="Restaurar proyecto">
          <i class="ph ph-arrow-counter-clockwise"></i>
        </button>
        <div class="project-card__content">
          <h3 class="project-card__name">${project.name}</h3>
          <p class="project-card__description">${project.description || 'Sin descripcion'}</p>
          <div class="project-card__stats">
            <span class="project-card__stat">
              <i class="ph ph-cards"></i>
              ${stats.total} tarjetas
            </span>
            <span class="project-card__stat">
              <i class="ph ph-archive"></i>
              Archivado
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const archivedSection = State.archivedProjects.length > 0 ? `
    <div class="dashboard__section">
      <div class="dashboard__section-header" onclick="toggleArchived()">
        <h3 class="dashboard__section-title">
          <i class="ph ph-archive"></i>
          Proyectos Archivados (${State.archivedProjects.length})
        </h3>
        <i class="ph ${State.showArchived ? 'ph-caret-up' : 'ph-caret-down'}"></i>
      </div>
      ${State.showArchived ? `<div class="dashboard__grid dashboard__grid--archived">${archivedCards}</div>` : ''}
    </div>
  ` : '';

  main.innerHTML = `
    <div class="dashboard">
      <div class="dashboard__header">
        <h2 class="dashboard__title">Centro de Mando</h2>
        <p class="dashboard__subtitle">Gestiona todos tus proyectos desde un solo lugar</p>
      </div>
      <div class="dashboard__grid">
        ${newProjectCard}
        ${projectCards}
      </div>
      ${archivedSection}
    </div>
  `;
}

function renderKanban() {
  const main = document.getElementById('main');
  const project = State.currentProject;

  const columns = COLUMNS.map(column => {
    const cards = State.getCardsByColumn(column.id);
    const cardsHtml = cards.map(card => renderCard(card)).join('');

    return `
      <div class="kanban__column kanban__column--${column.id}" data-column="${column.id}">
        <div class="kanban__column-header">
          <span class="kanban__column-title">
            <i class="ph ${column.icon}"></i>
            ${column.name}
            <span class="kanban__column-count">${cards.length}</span>
          </span>
          <button class="kanban__column-add" onclick="openModal('${column.id}')" title="Agregar tarjeta">
            <i class="ph ph-plus"></i>
          </button>
        </div>
        <div class="kanban__column-body" data-column="${column.id}">
          ${cardsHtml || '<div class="empty-state"><p class="empty-state__text">Sin tarjetas</p></div>'}
        </div>
      </div>
    `;
  }).join('');

  main.innerHTML = `
    <div class="breadcrumb">
      <span class="breadcrumb__item breadcrumb__item--link" onclick="loadDashboard()">
        <i class="ph ph-house"></i> Inicio
      </span>
      <span class="breadcrumb__separator">
        <i class="ph ph-caret-right"></i>
      </span>
      <span class="breadcrumb__item breadcrumb__item--current">${project.name}</span>
    </div>
    <div class="kanban">
      ${columns}
    </div>
  `;

  setupDragAndDrop();
}

function renderCard(card) {
  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Critica',
  };

  const tagsHtml = card.tags && card.tags.length > 0
    ? card.tags.map(tag => `<span class="card__tag">${tag}</span>`).join('')
    : '';

  return `
    <div class="card card--priority-${card.priority}" draggable="true" data-card-id="${card.id}">
      <div class="card__header">
        <h4 class="card__title">${card.title}</h4>
        <div class="card__actions">
          <button class="card__action" onclick="event.stopPropagation(); editCard('${card.id}')" title="Editar">
            <i class="ph ph-pencil-simple"></i>
          </button>
          <button class="card__action card__action--delete" onclick="event.stopPropagation(); deleteCard('${card.id}')" title="Eliminar">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      </div>
      ${card.description ? `<p class="card__description">${card.description}</p>` : ''}
      <div class="card__footer">
        <div class="card__tags">${tagsHtml}</div>
        <span class="card__priority card__priority--${card.priority}">${priorityLabels[card.priority]}</span>
      </div>
    </div>
  `;
}

// ============================================
// DRAG AND DROP
// ============================================

function setupDragAndDrop() {
  const cards = document.querySelectorAll('.card');
  const columns = document.querySelectorAll('.kanban__column-body');

  let draggedCard = null;

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCard = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.cardId);
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggedCard = null;
      columns.forEach(col => col.classList.remove('drag-over'));
    });
  });

  columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', (e) => {
      if (!column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
      }
    });

    column.addEventListener('drop', async (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');

      if (!draggedCard) return;

      const cardId = draggedCard.dataset.cardId;
      const newColumn = column.dataset.column;
      const currentColumn = draggedCard.closest('.kanban__column-body').dataset.column;

      if (newColumn === currentColumn) return;

      // Calculate new position (at the end)
      const existingCards = column.querySelectorAll('.card');
      const newPosition = existingCards.length;

      try {
        await API.moveCard(State.currentProject.slug, cardId, newColumn, newPosition);

        // Update local state
        const cardIndex = State.cards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
          State.cards[cardIndex].column = newColumn;
          State.cards[cardIndex].position = newPosition;
        }

        // Re-render
        renderKanban();
        showToast('Tarjeta movida', 'success');
      } catch (error) {
        showToast('Error al mover tarjeta', 'error');
      }
    });
  });
}

// ============================================
// MODAL HANDLERS
// ============================================

function openModal(column = 'backlog', cardData = null) {
  const modal = document.getElementById('cardModal');
  const form = document.getElementById('cardForm');
  const title = document.getElementById('modalTitle');

  // Reset form
  form.reset();
  document.getElementById('cardId').value = '';
  document.getElementById('cardColumn').value = column;

  if (cardData) {
    // Edit mode
    title.textContent = 'Editar Tarjeta';
    document.getElementById('cardId').value = cardData.id;
    document.getElementById('cardColumn').value = cardData.column;
    document.getElementById('cardTitle').value = cardData.title;
    document.getElementById('cardDescription').value = cardData.description || '';
    document.getElementById('cardPriority').value = cardData.priority;
    document.getElementById('cardTags').value = (cardData.tags || []).join(', ');
  } else {
    // Create mode
    title.textContent = 'Nueva Tarjeta';
  }

  modal.classList.add('active');
  document.getElementById('cardTitle').focus();
}

function closeModal() {
  const modal = document.getElementById('cardModal');
  modal.classList.remove('active');
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const cardId = document.getElementById('cardId').value;
  const column = document.getElementById('cardColumn').value;
  const cardData = {
    title: document.getElementById('cardTitle').value.trim(),
    description: document.getElementById('cardDescription').value.trim(),
    priority: document.getElementById('cardPriority').value,
    tags: document.getElementById('cardTags').value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0),
    column: column,
  };

  if (!cardData.title) {
    showToast('El titulo es obligatorio', 'error');
    return;
  }

  try {
    if (cardId) {
      // Update existing card
      await API.updateCard(State.currentProject.slug, cardId, cardData);
      const cardIndex = State.cards.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        State.cards[cardIndex] = { ...State.cards[cardIndex], ...cardData };
      }
      showToast('Tarjeta actualizada', 'success');
    } else {
      // Create new card
      const newCard = await API.createCard(State.currentProject.slug, cardData);
      State.cards.push(newCard);
      showToast('Tarjeta creada', 'success');
    }

    closeModal();
    renderKanban();
  } catch (error) {
    showToast(error.message || 'Error al guardar', 'error');
  }
}

function editCard(cardId) {
  const card = State.cards.find(c => c.id === cardId);
  if (card) {
    openModal(card.column, card);
  }
}

async function deleteCard(cardId) {
  if (!confirm('Estas seguro de eliminar esta tarjeta?')) {
    return;
  }

  try {
    await API.deleteCard(State.currentProject.slug, cardId);
    State.cards = State.cards.filter(c => c.id !== cardId);
    renderKanban();
    showToast('Tarjeta eliminada', 'success');
  } catch (error) {
    showToast('Error al eliminar tarjeta', 'error');
  }
}

// ============================================
// PROJECT MODAL HANDLERS
// ============================================

function openProjectModal() {
  const modal = document.getElementById('projectModal');
  document.getElementById('projectForm').reset();
  modal.classList.add('active');
  document.getElementById('projectName').focus();
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
}

async function handleProjectFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('projectName').value.trim();

  if (!name) {
    showToast('El nombre es obligatorio', 'error');
    return;
  }

  try {
    const newProject = await API.createProject(name);
    State.projects.unshift(newProject);
    closeProjectModal();
    renderDashboard();
    showToast('Proyecto creado', 'success');
  } catch (error) {
    showToast(error.message || 'Error al crear proyecto', 'error');
  }
}

// ============================================
// NAVIGATION
// ============================================

async function loadDashboard() {
  State.setCurrentProject(null);
  updateNav();

  showLoading();

  try {
    const [projectsData, archivedData] = await Promise.all([
      API.getProjects(),
      API.getArchivedProjects()
    ]);
    State.setProjects(projectsData.projects || []);
    State.setArchivedProjects(archivedData.projects || []);
    renderDashboard();
  } catch (error) {
    showToast('Error al cargar proyectos', 'error');
    renderDashboard();
  }
}

async function archiveProject(slug) {
  if (!confirm('¿Archivar este proyecto? Podras restaurarlo mas tarde.')) {
    return;
  }

  try {
    await API.archiveProject(slug);
    // Move from projects to archived
    const project = State.projects.find(p => p.slug === slug);
    if (project) {
      State.projects = State.projects.filter(p => p.slug !== slug);
      State.archivedProjects.unshift({ ...project, archived: true });
    }
    renderDashboard();
    showToast('Proyecto archivado', 'success');
  } catch (error) {
    showToast(error.message || 'Error al archivar', 'error');
  }
}

async function restoreProject(slug) {
  try {
    await API.restoreProject(slug);
    // Move from archived to projects
    const project = State.archivedProjects.find(p => p.slug === slug);
    if (project) {
      State.archivedProjects = State.archivedProjects.filter(p => p.slug !== slug);
      delete project.archived;
      State.projects.unshift(project);
    }
    renderDashboard();
    showToast('Proyecto restaurado', 'success');
  } catch (error) {
    showToast(error.message || 'Error al restaurar', 'error');
  }
}

function toggleArchived() {
  State.toggleShowArchived();
  renderDashboard();
}

async function loadProject(slug) {
  showLoading();

  try {
    const [projectData, cardsData] = await Promise.all([
      API.getProject(slug),
      API.getCards(slug),
    ]);

    State.setCurrentProject(projectData.project);
    State.setCards(cardsData.cards || []);
    updateNav();
    renderKanban();
  } catch (error) {
    showToast('Error al cargar proyecto', 'error');
    loadDashboard();
  }
}

function updateNav() {
  const nav = document.getElementById('projectNav');

  if (State.currentProject) {
    nav.innerHTML = `
      <a class="header__nav-item" onclick="loadDashboard()">
        <i class="ph ph-house"></i>
      </a>
      <span class="header__nav-item header__nav-item--active">
        ${State.currentProject.name}
      </span>
    `;
  } else {
    nav.innerHTML = `
      <span class="header__nav-item header__nav-item--active">
        <i class="ph ph-squares-four"></i> Proyectos
      </span>
    `;
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast';

  if (type === 'success') {
    toast.classList.add('toast--success');
  } else if (type === 'error') {
    toast.classList.add('toast--error');
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ============================================
// LOADING STATE
// ============================================

function showLoading() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="loading">
      <div class="loading__spinner"></div>
    </div>
  `;
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Card form submission
  document.getElementById('cardForm').addEventListener('submit', handleFormSubmit);

  // Card modal close handlers
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.querySelector('#cardModal .modal__backdrop').addEventListener('click', closeModal);

  // Project form submission
  document.getElementById('projectForm').addEventListener('submit', handleProjectFormSubmit);

  // Project modal close handlers
  document.getElementById('projectModalClose').addEventListener('click', closeProjectModal);
  document.getElementById('projectCancelBtn').addEventListener('click', closeProjectModal);
  document.querySelector('#projectModal .modal__backdrop').addEventListener('click', closeProjectModal);

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeProjectModal();
    }
  });

  // Initial load
  loadDashboard();
});

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================

window.loadDashboard = loadDashboard;
window.loadProject = loadProject;
window.openModal = openModal;
window.closeModal = closeModal;
window.editCard = editCard;
window.deleteCard = deleteCard;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.archiveProject = archiveProject;
window.restoreProject = restoreProject;
window.toggleArchived = toggleArchived;
