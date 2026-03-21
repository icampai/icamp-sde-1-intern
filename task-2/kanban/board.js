import { getState } from './state.js';

export function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  const { columns } = getState();

  columns.forEach((column, index) => {
    const colEl = document.createElement('div');
    colEl.className = 'column';
    colEl.dataset.id = column.id;

    colEl.innerHTML = `
      <div class="column-header">
        <h2>${column.title}</h2>
      </div>
      <div class="card-list"></div>
      <div class="column-footer">
        <button class="add-card-btn">Add card</button>
      </div>
    `;

    const cardList = colEl.querySelector('.card-list');

    if (column.cards.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-placeholder';
      empty.textContent = 'No cards yet';
      cardList.appendChild(empty);
    } else {
      column.cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.dataset.id = card.id;

        cardEl.innerHTML = `
          <div class="card-title">${card.title}</div>
          <div class="card-desc">${card.description || ''}</div>
          <div class="card-actions">
            <button class="move-left" ${index === 0 ? 'disabled' : ''}>←</button>
            <button class="move-right" ${index === columns.length - 1 ? 'disabled' : ''}>→</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;

        cardList.appendChild(cardEl);
      });
    }

    board.appendChild(colEl);
  });

  const addBtn = document.createElement('button');
  addBtn.id = 'add-column-btn';
  addBtn.textContent = 'Add column';

  board.appendChild(addBtn);
}