// minesweeper main js v1

// model

let minefield = [];
let spacesRevealed = 0;
let minesFlagged = 0;
let firstTile = true;

const baseModes = [
  {
    gamemode: 'Beginner',
    rows: 9,
    columns: 9,
    mines: 10,
    isActive: false
  },
  {
    gamemode: 'Intermediate',
    rows: 16,
    columns: 16,
    mines: 40,
    isActive: false
  },
  {
    gamemode: 'Expert',
    rows: 16,
    columns: 30,
    mines: 99,
    isActive: false
  }
]
const defaultMode = 2;
baseModes[defaultMode].isActive = true
let currentMode = defaultMode;
let previousMode = defaultMode;

const repeatString = (str, num) => {
  if (num <= 1) {
    return str;
  }
  return str + repeatString(str, num-1);
}

const toggleActive = (modeToActivate) => {
  baseModes.forEach(mode => {
    mode.isActive = false;
  });
  for (let i = 0; i < 3; i++) {
    if (baseModes[i].gamemode == modeToActivate.gamemode) {
      currentMode = i;
    }
  }

  modeToActivate.isActive = true;
}

const createNew = () => {
  previousMode = currentMode;
  const rows = baseModes[currentMode].rows;
  const columns = baseModes[currentMode].columns;
  firstTile = true;

  loadGrid(rows, columns);
}

const createMineField = () => {
  const mode = baseModes[currentMode];
  return(Array.from(Array(mode.rows), () => new Array(mode.columns).fill(0)));
}

const placeMines = field => {
  const mode = baseModes[currentMode];

  let row;
  let column;
  for (let i = 0; i < mode.mines; i++) {
    row = Math.floor(Math.random() * mode.rows);
    column = Math.floor(Math.random() * mode.columns);
    if (field[row][column] != 0) {i--; continue;}
    field[row][column]++;
  }
  return field;
}

const replaceMines = (row, column) => {
  // load mines not near first click
  const mode = baseModes[currentMode];
  minefield = createMineField();
  let coords = [[row, column]];
  minefield[row][column] = 2;
  if (row < mode.rows - 1) {
    minefield[row+1][column] = 2;
    coords.push([row+1, column]);
  }
  if (row > 0) {
    minefield[row-1][column] = 2;
    coords.push([row-1, column]);
  }
  if (column < mode.columns - 1) {
    minefield[row][column+1] = 2;
    coords.push([row, column+1]);
  }
  if (column > 0) {
    minefield[row][column-1] = 2;
    coords.push([row, column-1]);
  }
  if (row < mode.rows - 1 && column < mode.columns - 1) {
    minefield[row+1][column+1] = 2;
    coords.push([row+1, column+1]);
  }
  if (row > 0 && column < mode.columns - 1) {
    minefield[row-1][column+1] = 2;
    coords.push([row-1, column+1]);
  }
  if (row < mode.rows - 1 && column > 0) {
    minefield[row+1][column-1] = 2;
    coords.push([row+1, column-1]);
  }
  if (row > 0 && column > 0) {
    minefield[row-1][column-1] = 2;
    coords.push([row-1, column-1]);
  }
  minefield = placeMines(minefield);
  coords.forEach(coord => {
    minefield[coord[0]][coord[1]] = 0;
  });
  firstTile = false;
}

const checkWin = () => {
  const mode = baseModes[currentMode];
  return spacesRevealed == (mode.rows * mode.columns) - mode.mines;
}

const showFlags = () => {
  // display flags on unflaggged mines
}

const revealedMine = idIsMine => {
  const idCoords = idIsMine.split(/_/);
  return minefield[+idCoords[0]][+idCoords[1]] == 1;
}

const revealMines = () => {
  // display location of all mines and misplaced flags
}

const recursiveClear = (row, column) => {
  document.getElementById(row + '_' + column).onclick = '';
  document.getElementById(row + '_' + column).oncontextmenu = '';
  if (document.getElementById(row + '_' + column).classList.contains('revealed-clear')) {return};
  spacesRevealed ++;
  const mode = baseModes[currentMode];
  const surroundingMines = getSurrounding(row, column);
  if (surroundingMines > 0) {
    displayNumber(row, column, surroundingMines);
    return;
  }
  displayClear(row, column);
  if (row < mode.rows - 1 && minefield[row+1][column] == 0) {
    recursiveClear(row+1, column);
  }
  if (row > 0 && minefield[row-1][column] == 0) {
    recursiveClear(row-1, column);
  }
  if (column < mode.columns - 1 && minefield[row][column+1] == 0) {
    recursiveClear(row, column+1);
  }
  if (column > 0 && minefield[row][column-1] == 0) {
    recursiveClear(row, column-1);
  }
  if (row < mode.rows - 1 && column < mode.columns - 1 && minefield[row+1][column+1] == 0) {
    recursiveClear(row+1, column+1);
  }
  if (row > 0 && column < mode.columns - 1 && minefield[row-1][column+1] == 0) {
    recursiveClear(row-1, column+1);
  }
  if (row < mode.rows - 1 && column > 0 && minefield[row+1][column-1] == 0) {
    recursiveClear(row+1, column-1);
  }
  if (row > 0 && column > 0 && minefield[row-1][column-1] == 0) {
    recursiveClear(row-1, column-1);
  }
}

const getSurrounding = (row, column) => {
  const mode = baseModes[currentMode];
  let surrounding = 0;
  if (row < mode.rows - 1 && minefield[row+1][column] == 1) {surrounding++}
  if (row > 0 && minefield[row-1][column] == 1) {surrounding++}
  if (column < mode.columns - 1 && minefield[row][column+1] == 1) {surrounding++}
  if (column > 0 && minefield[row][column-1] == 1) {surrounding++}
  if (row < mode.rows - 1 && column < mode.columns - 1 && minefield[row+1][column+1] == 1) {surrounding++}
  if (row > 0 && column < mode.columns - 1 && minefield[row-1][column+1] == 1) {surrounding++}
  if (row < mode.rows - 1 && column > 0 && minefield[row+1][column-1] == 1) {surrounding++}
  if (row > 0 && column > 0 && minefield[row-1][column-1] == 1) {surrounding++}
  return surrounding;
}

const checkFlag = idToCheck => {
  const flagged =  document.getElementById(idToCheck).classList.contains('flagged');
  if (flagged) {minesFlagged--}
  else {minesFlagged++}
  return flagged;
}

// controller

const onSettings = () => {
  loadSettingsPage();
}

const onExit = () => {
  toggleActive(baseModes[previousMode]);
  unloadSettingsPage();
}

const onCreate = () => {
    createNew();
    unloadSettingsPage();
}

const onActive = (modeToActivate) => {
  return () => {
    toggleActive(modeToActivate);
    displayActive(modeToActivate);
  }
}

const onReveal = event => {
  const tileToReveal = event.target;
  const tileId = tileToReveal.id;
  const idCoords = tileId.split(/_/);

  if (firstTile) {replaceMines(+idCoords[0], +idCoords[1])}

  if (revealedMine(tileId)) {
    revealMines();
    gameLost();
    return;
  }
  else {
    recursiveClear(+idCoords[0], +idCoords[1]);
  }
  
  if (checkWin()) {
    showFlags();
    gameWon();
  }

}

const onFlag = event => {
  const tileToFlag = event.target;
  const tileId = tileToFlag.id;
  const idCoords = tileId.split(/_/);

  if (checkFlag(tileId)) {
    removeFlag(tileId);
  }
  else {
    displayFlag(tileId);
  }
}

// view
const addElement = (elements, destination) => {
  elements.forEach(element => {
    destination.append(element);
  });
}

const displayActive = (activeMode) => {
  document.getElementsByClassName('settings-active-button')[0].classList.remove('settings-active-button');
  const activeButton = document.getElementById('settings-mode-' + baseModes[currentMode].gamemode);
  activeButton.classList.add('settings-active-button');
}

const unloadSettingsPage = () => {
  document.getElementById('settings-greyout').remove();
  document.getElementById('header-title').innerText = 'Minesweeper - ' + baseModes[currentMode].gamemode;
}

const displayNumber = (row, column, mineCount) => {
  const toDisplayNumber = document.getElementById(row + '_' + column);
  toDisplayNumber.classList.remove('unrevealed');
  toDisplayNumber.classList.add('revealed-clear');

  const numberImage = document.createElement('img');
  numberImage.className = 'm-button-icon';
  numberImage.src = `icons/${mineCount}.PNG`;

  toDisplayNumber.append(numberImage);
}

const displayClear = (row, column) => {
  const toClear = document.getElementById(row + '_' + column);
  toClear.classList.remove('unrevealed');
  toClear.classList.add('revealed-clear');
}

const displayFlag = idToFlag => {
  const toFlag = document.getElementById(idToFlag);
  toFlag.classList.add('flagged');

  const flagImage = document.createElement('img');
  flagImage.className = 'm-button-icon';
  flagImage.src = 'icons/flag.PNG';

  toFlag.append(flagImage);
}

const removeFlag = flagToRemove => {
  const toUnFLag = document.getElementById(flagToRemove);
  toUnFLag.classList.remove('flagged');
  toUnFLag.innerHTML = '';
}

const loadSettingsPage = () => { // settings page
  const greyout = document.createElement('div');
  greyout.id = 'settings-greyout';
  addElement([greyout], document.body);

  const menu = document.createElement('div');
  menu.id = 'settings-menu-container';
  addElement([menu], greyout);

  baseModes.forEach(mode => {
    const modebutton = document.createElement('button');
    modebutton.id = 'settings-mode-' + mode.gamemode;
    modebutton.className = 'settings-button';
    if (mode.isActive) {
      modebutton.classList.add('settings-active-button');
    }
    modebutton.innerText = mode.gamemode + ' - ' + mode.rows + 'x' + mode.columns + ' ' + mode.mines + ' mines';
    modebutton.onclick = onActive(mode);
    addElement([modebutton], menu);
  });

  const actionDiv = document.createElement('div');
  actionDiv.id = 'action-container';
  addElement([actionDiv], menu);

  const create = document.createElement('button');
  create.id = 'settings-create';
  create.className = 'settings-button action';
  create.innerText = 'Create';
  create.onclick = onCreate;

  const exit = document.createElement('button');
  exit.id = 'settings-exit'
  exit.className = 'settings-button action';
  exit.innerText = 'Exit'
  exit.onclick = onExit;

  addElement([create, exit], actionDiv)
}

const initialize = () => { // load page
  const main = document.createElement('main');
  main.id = 'main-container';
  addElement([main], document.body);


  // header
  const header = document.createElement('header');
  header.id = 'header';

  const headerTitle = document.createElement('h1');
  headerTitle.id = 'header-title';
  headerTitle.innerText = 'Minesweeper - ' + baseModes[currentMode].gamemode;
  
  const settingsIcon = document.createElement('img');
  settingsIcon.src = 'icons/settings.png';
  settingsIcon.id = 'settings-icon';
  settingsIcon.onclick = onSettings;

  addElement([headerTitle, settingsIcon], header);


  // game display
  const display = document.createElement('section');
  display.id = 'game-display';

  addElement([header, display], main);
  loadGrid(baseModes[defaultMode].rows, baseModes[defaultMode].columns);
}

// loads game board givin number of rows and columns
const loadGrid = (rows, columns) => {
  // removes current buttons
  const display = document.getElementById('game-display');
  display.innerHTML = ''
  display.style.gridTemplateColumns = repeatString('1fr ', columns);
  display.addEventListener("contextmenu", e => {e.preventDefault()});

  let gridButton;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      gridButton = document.createElement('button');
      gridButton.id = i + '_' + j;
      gridButton.className = 'minesweeper-button unrevealed';
      gridButton.onclick = onReveal;
      gridButton.oncontextmenu = onFlag;
      display.append(gridButton);
    }
  }
  minefield = placeMines(createMineField());
}

const gameLost = () => {
  // lost game menu
  console.log('lost');
}

const gameWon = () => {
  // won game menu
  console.log('won');
}

initialize();