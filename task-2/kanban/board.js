// board.js
import { getState } from './state.js';
import { applyFilter } from './events.js';

function createCard(card, isFirst, isLast) {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.id = card.id;

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = card.title;
  el.appendChild(title);

  if (card.description) {
    const desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.textContent = card.description;
    el.appendChild(desc);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';

  const moveLeft = document.createElement('button');
  moveLeft.className = 'move-left';
  moveLeft.textContent = '←';
  if (isFirst) moveLeft.disabled = true;

  const moveRight = document.createElement('button');
  moveRight.className = 'move-right';
  moveRight.textContent = '→';
  if (isLast) moveRight.disabled = true;

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  actions.appendChild(moveLeft);
  actions.appendChild(moveRight);
  el.appendChild(actions);

  return el;
}

function createColumn(column, isFirst, isLast) {
  const el = document.createElement('div');
  el.className = 'column';
  el.dataset.id = column.id;

  // Header
  const header = document.createElement('div');
  header.className = 'column-header';

  const h2 = document.createElement('h2');
  h2.textContent = column.title;

  const renameBtn = document.createElement('button');
  renameBtn.className = 'rename-btn';
  renameBtn.textContent = '✏';

  const deleteColBtn = document.createElement('button');
  deleteColBtn.className = 'delete-col-btn';
  deleteColBtn.textContent = '✕';

  header.appendChild(h2);
  header.appendChild(renameBtn);
  header.appendChild(deleteColBtn);
  el.appendChild(header);

  // Card list
  const cardList = document.createElement('div');
  cardList.className = 'card-list';

  if (column.cards.length === 0) {
    const placeholder = document.createElement('p');
    placeholder.className = 'empty-placeholder';
    placeholder.textContent = 'No cards yet';
    cardList.appendChild(placeholder);
  } else {
    column.cards.forEach(card => {
      cardList.appendChild(createCard(card, isFirst, isLast));
    });
  }
  el.appendChild(cardList);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'column-footer';

  const addCardBtn = document.createElement('button');
  addCardBtn.className = 'add-card-btn';
  addCardBtn.textContent = '+ Add card';

  footer.appendChild(addCardBtn);
  el.appendChild(footer);

  return el;
}

export function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  const { columns } = getState();

  columns.forEach((col, idx) => {
    const isFirst = idx === 0;
    const isLast  = idx === columns.length - 1;
    board.appendChild(createColumn(col, isFirst, isLast));
  });

  const addColumnBtn = document.createElement('button');
  addColumnBtn.id = 'add-column-btn';
  addColumnBtn.textContent = '+ Add column';
  board.appendChild(addColumnBtn);

  applyFilter();
}
