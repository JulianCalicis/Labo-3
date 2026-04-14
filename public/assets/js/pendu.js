//#region Values
const AVAILABLE_WORDS = [
  "Pomme",
  "Poire",
  "Peche",
  "Prune",
  "Purée",
  "Pique-Nique",
  "Jambon",
];
const ALLOWED_LETTER_VALUES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const MAX_TRIES = 10;

const letterButtons = [];
/** Word to guess */
let selectedWord;
/** Word found by the player */
let foundWord;
/** Current failures of the player */
let currentFailures;
/** The state of the game */
let isGameOver;
//#endregion Values

//#region Functions
function init() {
  document
    .querySelector("button[type='reset']")
    .addEventListener("click", reset);

  document.querySelector("#trouve").addEventListener("mouseover", (event) => {
    event.target.innerHTML = "Double clic pour la réponse";
  });
  document.querySelector("#trouve").addEventListener("dblclick", (event) => {
    event.target.innerHTML = selectedWord;
  });
  document.querySelector("#trouve").addEventListener("mouseout", (event) => {
    event.target.innerHTML = foundWord;
  });

  createButtons();
  reset();
}
function reset() {
  if (selectedWord !== undefined && !isGameOver) {
    let message = "Abandon";
    if (currentFailures > 0) {
      message += ` après ${currentFailures} faute`;
      if (currentFailures > 1) message += "s";
    } else {
      message += " sans fautes";
    }
    showAnswer(message);
  }
  selectedWord = selectRandomWord(AVAILABLE_WORDS);
  foundWord = Array(selectedWord.length).fill("_").join("");
  const matches = [
    ...removeAccents(selectedWord)
      .toUpperCase()
      .matchAll(`[^${ALLOWED_LETTER_VALUES}]`),
  ];
  for (const match of matches) {
    foundWord = replaceCharAt(
      foundWord,
      match.index,
      selectedWord[match.index],
    );
  }

  onFoundWordChanged();
  currentFailures = 0;
  onCurrentTriesChanged();
  isGameOver = false;
  onGameOverChanged();
}
/** Selects a random word using Math.random and the current seconds to randomise more*/
function selectRandomWord(mots) {
  const selectedId = Math.floor(Math.random() * mots.length);
  i = selectedId;
  return mots[selectedId];
}
function createButtons() {
  for (let i = 0; i < ALLOWED_LETTER_VALUES.length; i++) {
    const letter = ALLOWED_LETTER_VALUES[i];
    letterButtons[i] = document.createElement("button");
    letterButtons[i].type = "button";
    letterButtons[i].textContent = letter;
    letterButtons[i].classList.add("letter-button");

    letterButtons[i].addEventListener("click", onLetterButtonClick);

    document
      .querySelector("menu#letter-button-menu")
      .appendChild(letterButtons[i]);
  }
}
function getHangedMan(step) {
  let hangedMan;
  switch (step) {
    case 0:
      hangedMan =
        " ┌─────╴  \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲       ";
      break;
    case 1:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲       ";
      break;
    case 2:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲       ";
      break;
    case 3:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │     ╹  \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲       ";
      break;
    case 4:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼┛  \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲       ";
      break;
    case 5:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼┻╾ \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲       ";
      break;
    case 6:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │     ╹  \r\n" +
        " │        \r\n" +
        "╱│╲       ";
      break;
    case 7:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┛  \r\n" +
        " │    ╯   \r\n" +
        "╱│╲       ";
      break;
    case 8:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┻╮ \r\n" +
        " │    ╯ ╰ \r\n" +
        "╱│╲       ";
      break;
    case 9:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┻╮ \r\n" +
        " │    ╯ ╰ \r\n" +
        "╱│╲   ╿╿╿ ";
      break;
    case 10:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☠ \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┻╮ \r\n" +
        " │    ╯ ╰ \r\n" +
        "╱│╲   ╿╿╿ ";
      break;
  }
  return hangedMan;
}
function replaceCharAt(string, index, char) {
  return string.substring(0, index) + char + string.substring(index + 1);
}
function checkWord(inputLetter) {
  const matches = [
    ...removeAccents(selectedWord)
      .toLowerCase()
      .matchAll(inputLetter.toLowerCase()),
  ];
  if (matches.length > 0) {
    for (const match of matches) {
      foundWord = replaceCharAt(
        foundWord,
        match.index,
        selectedWord[match.index],
      );
      onFoundWordChanged();
    }
  } else {
    currentFailures++;
    onCurrentTriesChanged();
  }
  return matches.length > 0;
}
function removeAccents(string) {
  result = string;
  result = string.normalize("NFKD").replaceAll(/\p{M}/gu, "");
  return result;
}
function areIdentficalNoCaseNoAccents(string1, string2) {
  return (
    removeAccents(string1.toLowerCase()) ===
    removeAccents(string2.toLowerCase())
  );
}
function toggleLetterButtons(disableButtons) {
  for (const letterButton of letterButtons) {
    letterButton.disabled = disableButtons;
    if (!disableButtons) letterButton.classList.remove("correct", "wrong");
  }
}
function showAnswer(reason) {
  alert(`${reason}, le mot était ${selectedWord} !`);
}
//#region Events
window.onload = () => {
  init();
};

function onFoundWordChanged() {
  document.querySelector("p#trouve").innerHTML = foundWord;
}
function onCurrentTriesChanged() {
  const sHangedMan = getHangedMan(currentFailures);
  updateHangedMan(sHangedMan);
}

function updateHangedMan(hangedManString) {
  document.querySelector("pre#hangedman").textContent = hangedManString;
}
function onLetterButtonClick(event) {
  event.currentTarget.disabled = true;
  const inputLetter = event.currentTarget.textContent;
  const hasMatch = checkWord(inputLetter);
  event.currentTarget.classList.add(hasMatch ? "correct" : "wrong");

  if (currentFailures >= MAX_TRIES) {
    showAnswer("Défaite");
    isGameOver = true;
    onGameOverChanged();
  } else if (areIdentficalNoCaseNoAccents(foundWord, selectedWord)) {
    alert("victoire");
    isGameOver = true;
    onGameOverChanged();
  } else {
    //Jouer encore
  }
}
function onGameOverChanged() {
  const resetButton = document.querySelector("button[type=reset]");
  if (isGameOver) {
    resetButton.classList.add("active");
    toggleLetterButtons(true);
  } else {
    resetButton.classList.remove("active");
    toggleLetterButtons(false);
  }
}
//#endregion Events
//#endregion Functions
