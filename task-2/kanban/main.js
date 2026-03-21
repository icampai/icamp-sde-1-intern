import { loadState } from './state.js';
import { renderBoard } from './board.js';
import { initEvents, applyFilter } from './events.js';

loadState();
renderBoard();
initEvents();
applyFilter();