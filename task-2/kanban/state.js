// state.js
const STORAGE_KEY = 'kanban-state';

const DEFAULT_STATE = {
  columns: [
    { id: 'col-1', title: 'To Do',       cards: [] },
    { id: 'col-2', title: 'In Progress', cards: [] },
    { id: 'col-3', title: 'Done',        cards: [] },
  ]
};

let state = { columns: [] };

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.columns)) throw new Error('corrupt');
    state = parsed;
  } catch {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  return state;
}

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function addColumn(title) {
  if (!title || !title.trim()) throw new Error('Column title cannot be empty');
  state.columns.push({
    id: 'col-' + Date.now(),
    title: title.trim(),
    cards: []
  });
  saveState();
}

export function removeColumn(id) {
  state.columns = state.columns.filter(c => c.id !== id);
  saveState();
}

export function renameColumn(id, newTitle) {
  if (!newTitle || !newTitle.trim()) throw new Error('Column title cannot be empty');
  const col = state.columns.find(c => c.id === id);
  if (col) {
    col.title = newTitle.trim();
    saveState();
  }
}

export function addCard(columnId, title, description = '') {
  if (!title || !title.trim()) throw new Error('Card title cannot be empty');
  const col = state.columns.find(c => c.id === columnId);
  if (col) {
    col.cards.push({
      id: 'card-' + Date.now(),
      title: title.trim(),
      description: description.trim()
    });
    saveState();
  }
}

export function updateCard(cardId, title, description) {
  if (!title || !title.trim()) throw new Error('Card title cannot be empty');
  for (const col of state.columns) {
    const card = col.cards.find(c => c.id === cardId);
    if (card) {
      card.title = title.trim();
      card.description = description.trim();
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
  const columns = state.columns;
  for (let ci = 0; ci < columns.length; ci++) {
    const cardIdx = columns[ci].cards.findIndex(c => c.id === cardId);
    if (cardIdx === -1) continue;
    const targetIdx = direction === 'left' ? ci - 1 : ci + 1;
    if (targetIdx < 0 || targetIdx >= columns.length) return; // no-op at boundary
    const [card] = columns[ci].cards.splice(cardIdx, 1);
    columns[targetIdx].cards.push(card);
    saveState();
    return;
  }
}
