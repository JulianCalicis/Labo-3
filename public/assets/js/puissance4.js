//@ts-check
//#region CONFIGURATION
/**
 * PURPOSE: Values that NEVER change while the app is running.
 * EXAMPLES: API Keys, Game Rules (Max Tries), Colors, or Fixed Settings.
 */
/**
 * @type {number}
 */
const ROWS = 6,
  COLUMNS = 7,
  MAX_TURNS = ROWS * COLUMNS;
const EMPTY_CSSCLASS_NAME = "empty";
//#endregion

//#region GLOBAL STATE
/**
 * PURPOSE: Variables that change as the user interacts with the app.
 * EXAMPLES: Current score, isGamePaused, currentUser, or an array of items.
 * TIP: Keep this section as small as possible!
 */
/** The number of turns already passed
 * @type {number}
 */
let turns = 0;
/** The grid containing the players tokens
 * @type {HTMLTableCellElement[][]} */
const grid = Array.from(Array(6), () => new Array(7));
/** @type {HTMLTableSectionElement?} */
let gridElement;
//#region Classes

//#endregion Classes
//#endregion

//#region 3. CORE LOGIC / ENGINE
//Todo: lien1-1: fonction qui détecte si la colonne peut accueillir ou non un jeton
/**
 * PURPOSE: The "Brain" of your app. These functions process data and
 * calculate results but usually DON'T touch the HTML directly.
 * EXAMPLES: calculateScore(), validatePassword(), checkWinner().
 */
//#endregion

//#region 4. UI & DISPLAY UPDATES
//Todo: lien1-2: fonctionne qui utilise la fonction du lien1-1 et qui change la bordure du tableau ? et les cellules de la colonne disponibles de la ligne tou en haut jusqu'au fond de la colonne (pas tout en bas)
/**
 * PURPOSE: Functions that strictly update the HTML/CSS based on the state.
 * EXAMPLES: renderList(), showErrorMessage(), toggleLoadingSpinner().
 */
//#endregion

//#region 5. EVENT HANDLERS & INITIALIZATION
/**
 * PURPOSE: The "Nerve Center." This connects the user's actions to the logic.
 * EXAMPLES: setupEventListeners(), onButtonClick(), window.onload.
 */
/** @param {PointerEvent} event  */
function onCellClick(event) {
  const clickedCell = /** @type {HTMLTableCellElement}*/ (event.target);
  const clickedColumn = clickedCell.cellIndex;

  const element = findBottomCellOfColumn(clickedColumn);
  element.style.backgroundColor = "red";
  element.classList.remove(EMPTY_CSSCLASS_NAME);
}
window.onload = () => {
  makeGrid();
  for (const lineElement of grid) {
    for (const cellElement of lineElement) {
      cellElement.addEventListener("click", (event) => onCellClick(event));
    }
  }

  // Call your startup functions here
};
/** Finds the cell at the bottom of a column that has been clicked
 *  @param {number} clickedColumnId The id of the clicked column  */
function findBottomCellOfColumn(clickedColumnId) {
  if (!grid[0][clickedColumnId].classList.contains(EMPTY_CSSCLASS_NAME)) {
    const errorMessage = `Impossible de placer le jeton, la colonne N°${clickedColumnId + 1} d'id ${clickedColumnId} est pleine`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  let line;
  for (line = 1; line < grid.length; line++) {
    if (!grid[line][clickedColumnId].classList.contains(EMPTY_CSSCLASS_NAME)) {
      break;
    }
  }
  return grid[line - 1][clickedColumnId];
}
/** Creates the HTML grid containing the cells (Sets "gridElement" and "grid") */
function makeGrid() {
  gridElement = document.querySelector("table#grid>tbody");
  if (gridElement == null || gridElement.parentElement == null)
    throw new Error("Grille non trouvée");

  gridElement.parentElement.style.setProperty("--COLUMNS", COLUMNS.toString());
  gridElement.parentElement.style.setProperty("--ROWS", ROWS.toString());

  for (let line = 0; line < ROWS; line++) {
    const rowElement = document.createElement("tr");
    gridElement.appendChild(rowElement);
    for (let column = 0; column < COLUMNS; column++) {
      const cellElement = document.createElement("td");
      rowElement.appendChild(cellElement);
      grid[line][column] = cellElement;
    }
  }
  emptyCells();
}
/** Empty the grid's cells if the grid is already defined */

function emptyCells() {
  if (gridElement == null) {
    console.warn("Impossible to empty the grid, it is not defined yet");
    return;
  }
  turns = 0;
  gridElement.querySelectorAll("td").forEach((cellElement) => {
    cellElement.classList.add(EMPTY_CSSCLASS_NAME);
  });
}
//#endregion

//#region 6. UTILS & HELPERS
/**
 * PURPOSE: Tiny, generic "toolbelt" functions that could work in any project.
 * EXAMPLES: formatDate(), getRandomNumber(), capitalizeString().
 */
//#endregion
//#region Todo List

//TODO: Permettre à l'utilisateur de changer l'affichage

//#endregion Todo List
