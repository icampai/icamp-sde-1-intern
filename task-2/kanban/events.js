import {
  addColumn,
  addCard,
  updateCard,
  removeCard,
  moveCard
} from './state.js';

import { renderBoard } from './board.js';

export function initEvents() {
  const searchInput = document.getElementById('search');
  const board = document.getElementById('board');

  searchInput.addEventListener('input', applyFilter);

  board.addEventListener('click', (e) => {
    const target = e.target;

    // ADD COLUMN
    if (target.id === 'add-column-btn') {
      const title = prompt('Enter column title');
      if (!title) return;

      try {
        addColumn(title);
        renderBoard();
        applyFilter();
      } catch (err) {
        alert(err.message);
      }
    }

    // ADD CARD
    if (target.classList.contains('add-card-btn')) {
      const colId = target.closest('.column').dataset.id;

      const title = prompt('Enter card title');
      if (!title) return;

      const desc = prompt('Enter description') || '';

      try {
        addCard(colId, title, desc);
        renderBoard();
        applyFilter();
      } catch (err) {
        alert(err.message);
      }
    }

    // DELETE CARD
    if (target.classList.contains('delete-btn')) {
      const cardId = target.closest('.card').dataset.id;

      if (confirm('Delete card?')) {
        removeCard(cardId);
        renderBoard();
        applyFilter();
      }
    }

    // MOVE LEFT
    if (target.classList.contains('move-left')) {
      const cardId = target.closest('.card').dataset.id;

      moveCard(cardId, 'left');
      renderBoard();
      applyFilter();
    }

    // MOVE RIGHT
    if (target.classList.contains('move-right')) {
      const cardId = target.closest('.card').dataset.id;

      moveCard(cardId, 'right');
      renderBoard();
      applyFilter();
    }

    // EDIT CARD
    if (target.classList.contains('edit-btn')) {
      const cardId = target.closest('.card').dataset.id;

      const title = prompt('New title');
      if (!title) return;

      const desc = prompt('New description') || '';

      try {
        updateCard(cardId, title, desc);
        renderBoard();
        applyFilter();
      } catch (err) {
        alert(err.message);
      }
    }
  });
}

export function applyFilter() {
  const query = document.getElementById('search').value.toLowerCase();
  const columns = document.querySelectorAll('.column');

  columns.forEach(col => {
    const cards = col.querySelectorAll('.card');
    let visible = 0;

    cards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();

      if (title.includes(query)) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    col.style.opacity = visible === 0 ? '0.4' : '1';
  });
}