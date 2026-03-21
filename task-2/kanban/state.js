// state.js

const STORAGE_KEY = 'kanban-state';

const DEFAULT_STATE = {
  columns: [
    { id: 'col-1', title: 'To Do', cards: [] },
    { id: 'col-2', title: 'In Progress', cards: [] },
    { id: 'col-3', title: 'Done', cards: [] },
  ]
};

let state = { columns: [] };

// LOAD & SAVE
export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      state = structuredClone(DEFAULT_STATE);
      return state;
    }

    const parsed = JSON.parse(stored);

    if (!parsed || !Array.isArray(parsed.columns)) {
      state = structuredClone(DEFAULT_STATE);
      return state;
    }

    state = parsed;
    return state;

  } catch {
    state = structuredClone(DEFAULT_STATE);
    return state;
  }
}

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

// COLUMN OPERATIONS
export function addColumn(title) {
  if (!title || title.trim() === '') {
    throw new Error('Column title cannot be empty');
  }

  state.columns.push({
    id: 'col-' + Date.now(),
    title: title.trim(),
    cards: []
  });

  saveState();
}

export function removeColumn(id) {
  state.columns = state.columns.filter(col => col.id !== id);
  saveState();
}

export function renameColumn(id, newTitle) {
  if (!newTitle || newTitle.trim() === '') {
    throw new Error('Column title cannot be empty');
  }

  const col = state.columns.find(c => c.id === id);
  if (col) {
    col.title = newTitle.trim();
    saveState();
  }
}

// CARD OPERATIONS
export function addCard(columnId, title, description = '') {
  if (!title || title.trim() === '') {
    throw new Error('Card title cannot be empty');
  }

  const col = state.columns.find(c => c.id === columnId);
  if (!col) return;

  col.cards.push({
    id: 'card-' + Date.now(),
    title: title.trim(),
    description: description || ''
  });

  saveState();
}

export function updateCard(cardId, title, description) {
  if (!title || title.trim() === '') {
    throw new Error('Card title cannot be empty');
  }

  for (const col of state.columns) {
    const card = col.cards.find(c => c.id === cardId);
    if (card) {
      card.title = title.trim();
      card.description = description || '';
      saveState();
      return;
    }
  }
}

export function removeCard(cardId) {
  for (const col of state.columns) {
    const idx = col.cards.findIndex(c => c.id === cardId);
    if (idx !== -1) {
      col.cards.splice(idx, 1);
      saveState();
      return;
    }
  }
}

export function moveCard(cardId, direction) {
  for (let i = 0; i < state.columns.length; i++) {
    const col = state.columns[i];
    const idx = col.cards.findIndex(c => c.id === cardId);

    if (idx !== -1) {
      const target =
        direction === 'left' ? i - 1 :
        direction === 'right' ? i + 1 : i;

      if (target < 0 || target >= state.columns.length) return;

      const [card] = col.cards.splice(idx, 1);
      state.columns[target].cards.push(card);

      saveState();
      return;
    }
  }
}