// events.js
import {
  addColumn, removeColumn, renameColumn,
  addCard, updateCard, removeCard, moveCard,
  getState
} from './state.js';
import { renderBoard } from './board.js';

// Tracks the currently open inline form so we can close it before opening another
let _openFormRestore = null;

function getColumnId(el) {
  return el.closest('.column')?.dataset.id;
}

function getCardId(el) {
  return el.closest('.card')?.dataset.id;
}

function closeOpenForms() {
  if (_openFormRestore) {
    _openFormRestore();
    _openFormRestore = null;
  }
}

function openAddCardForm(columnEl) {
  closeOpenForms();

  const footer = columnEl.querySelector('.column-footer');
  const originalHTML = footer.innerHTML;

  _openFormRestore = () => { footer.innerHTML = originalHTML; };

  // Build inline form
  footer.innerHTML = '';

  const form = document.createElement('div');
  form.className = 'inline-form';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'inline-form-title';
  titleInput.placeholder = 'Card title';

  const descTextarea = document.createElement('textarea');
  descTextarea.className = 'inline-form-desc';
  descTextarea.placeholder = 'Description (optional)';

  const errorMsg = document.createElement('p');
  errorMsg.className = 'inline-form-error';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'inline-form-save';
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'inline-form-cancel';
  cancelBtn.textContent = 'Cancel';

  const btnRow = document.createElement('div');
  btnRow.className = 'inline-form-btns';
  btnRow.appendChild(saveBtn);
  btnRow.appendChild(cancelBtn);

  form.appendChild(titleInput);
  form.appendChild(descTextarea);
  form.appendChild(errorMsg);
  form.appendChild(btnRow);
  footer.appendChild(form);

  titleInput.focus();

  saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    if (!title) {
      errorMsg.textContent = 'Title is required.';
      titleInput.focus();
      return;
    }
    const colId = columnEl.dataset.id;
    addCard(colId, title, descTextarea.value);
    _openFormRestore = null;
    renderBoard();
  });

  cancelBtn.addEventListener('click', () => {
    closeOpenForms();
    renderBoard();
  });
}

function openEditCardForm(cardEl) {
  closeOpenForms();

  const cardId = cardEl.dataset.id;

  // Find current card data
  let cardData = null;
  for (const col of getState().columns) {
    const found = col.cards.find(c => c.id === cardId);
    if (found) { cardData = found; break; }
  }
  if (!cardData) return;

  const originalHTML = cardEl.innerHTML;
  _openFormRestore = () => { cardEl.innerHTML = originalHTML; };

  cardEl.innerHTML = '';

  const form = document.createElement('div');
  form.className = 'inline-form';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'inline-form-title';
  titleInput.value = cardData.title;

  const descTextarea = document.createElement('textarea');
  descTextarea.className = 'inline-form-desc';
  descTextarea.value = cardData.description;

  const errorMsg = document.createElement('p');
  errorMsg.className = 'inline-form-error';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'inline-form-save';
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'inline-form-cancel';
  cancelBtn.textContent = 'Cancel';

  const btnRow = document.createElement('div');
  btnRow.className = 'inline-form-btns';
  btnRow.appendChild(saveBtn);
  btnRow.appendChild(cancelBtn);

  form.appendChild(titleInput);
  form.appendChild(descTextarea);
  form.appendChild(errorMsg);
  form.appendChild(btnRow);
  cardEl.appendChild(form);

  titleInput.focus();
  titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);

  saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    if (!title) {
      errorMsg.textContent = 'Title is required.';
      titleInput.focus();
      return;
    }
    updateCard(cardId, title, descTextarea.value);
    _openFormRestore = null;
    renderBoard();
  });

  cancelBtn.addEventListener('click', () => {
    closeOpenForms();
    renderBoard();
  });
}

// Ticket 4: filter — operates on existing DOM, does NOT call renderBoard()
export function applyFilter() {
  const query = document.getElementById('search').value.toLowerCase();
  const columns = document.querySelectorAll('.column');

  columns.forEach(col => {
    const cards = col.querySelectorAll('.card');
    let visibleCount = 0;

    cards.forEach(card => {
      const titleEl = card.querySelector('.card-title');
      if (!titleEl) return;
      const title = titleEl.textContent.toLowerCase();
      const match = !query || title.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    // Dim columns with no visible cards (empty placeholder always stays visible)
    col.style.opacity = (query && visibleCount === 0) ? '0.4' : '1';
  });
}

export function initEvents() {
  const board = document.getElementById('board');

  // Single delegated click listener on #board
  board.addEventListener('click', (e) => {
    const target = e.target;

    // ── Add column
    if (target.id === 'add-column-btn') {
      const title = prompt('Column title:');
      if (title === null) return;
      try {
        addColumn(title);
        renderBoard();
      } catch (err) {
        alert(err.message);
      }
      return;
    }

    // ── Rename column
    if (target.classList.contains('rename-btn')) {
      const colId  = getColumnId(target);
      const col    = getState().columns.find(c => c.id === colId);
      const newTitle = prompt('Rename column:', col.title);
      if (newTitle === null) return;
      try {
        renameColumn(colId, newTitle);
        renderBoard();
      } catch (err) {
        alert(err.message);
      }
      return;
    }

    // ── Delete column
    if (target.classList.contains('delete-col-btn')) {
      const colId = getColumnId(target);
      const col   = getState().columns.find(c => c.id === colId);
      if (col.cards.length > 0) {
        const ok = confirm(`Delete "${col.title}" and all its cards?`);
        if (!ok) return;
      }
      removeColumn(colId);
      renderBoard();
      return;
    }

    // ── Add card (open inline form in column footer)
    if (target.classList.contains('add-card-btn')) {
      const colEl = target.closest('.column');
      openAddCardForm(colEl);
      return;
    }

    // ── Edit card (open inline form in card)
    if (target.classList.contains('edit-btn')) {
      const cardEl = target.closest('.card');
      openEditCardForm(cardEl);
      return;
    }

    // ── Delete card
    if (target.classList.contains('delete-btn')) {
      const ok = confirm('Delete this card?');
      if (!ok) return;
      const cardId = getCardId(target);
      removeCard(cardId);
      renderBoard();
      return;
    }

    // ── Move card left
    if (target.classList.contains('move-left') && !target.disabled) {
      const cardId = getCardId(target);
      moveCard(cardId, 'left');
      renderBoard();
      return;
    }

    // ── Move card right
    if (target.classList.contains('move-right') && !target.disabled) {
      const cardId = getCardId(target);
      moveCard(cardId, 'right');
      renderBoard();
      return;
    }
  });

  // Ticket 4: wire search input
  document.getElementById('search').addEventListener('input', applyFilter);
}
