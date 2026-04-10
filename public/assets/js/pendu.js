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
//#endregion Values

//#region Functions
function init() {
  document
    .querySelector("button[type='reset']")
    .addEventListener("click", reset);

  createButtons();
  reset();
}
function reset() {
  toggleLetterButtons(false);
  if (selectedWord !== undefined) {
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
  // const matches = [...selectedWord.matchAll(/-|\s|\./g)];
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

  // document.querySelector("p#triche").innerHTML = selectedWord;
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
        "╱│╲          ";
      break;
    case 2:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲          ";
      break;
    case 3:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │     ╹  \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲          ";
      break;
    case 4:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼┛ \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲          ";
      break;
    case 5:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼┻╾ \r\n" +
        " │        \r\n" +
        " │        \r\n" +
        "╱│╲          ";
      break;
    case 6:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │     ╹  \r\n" +
        " │        \r\n" +
        "╱│╲          ";
      break;
    case 7:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┛  \r\n" +
        " │    ╯   \r\n" +
        "╱│╲          ";
      break;
    case 8:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┻╮ \r\n" +
        " │    ╯ ╰ \r\n" +
        "╱│╲          ";
      break;
    case 9:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☺  \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┻╮ \r\n" +
        " │    ╯ ╰ \r\n" +
        "╱│╲   ╿╿╿    ";
      break;
    case 10:
      hangedMan =
        " ┌─────┐  \r\n" +
        " │     ☠ \r\n" +
        " │    ╼╋╾ \r\n" +
        " │    ╭┻╮ \r\n" +
        " │    ╯ ╰ \r\n" +
        "╱│╲   ╿╿╿    ";
      break;
  }
  return hangedMan;
}
function replaceCharAt(string, index, char) {
  return string.substring(0, index) + char + string.substring(index + 1);
}
function checkWord(inputLetter) {
  //TODO: comparer la lettre qu'on entre avec le mot sélectionné, si il est trouvé, on l'ajoute à l'affichage du mot, sinon, il avance d'une étape
  //! TODO: S'occuper des accents
  const matches = [
    ...removeAccents(selectedWord)
      .toLowerCase()
      .matchAll(inputLetter.toLowerCase()),
  ];
  if (matches.length > 0) {
    //TODO: Ajouter les lettres à l'affichage
    // alert("trouvé");
    for (const match of matches) {
      foundWord = replaceCharAt(
        foundWord,
        match.index,
        selectedWord[match.index],
      );
      // foundWord.substring(0, match.index) +
      // selectedWord[match.index] +
      // foundWord.substring(match.index + 1);
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
    // letterButton.style.pointerEvents = disableButtons ? "none" : "auto";
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
  // event.currentTarget.style.pointerEvents = "none";
  const inputLetter = event.currentTarget.textContent;
  const hasMatch = checkWord(inputLetter);
  event.currentTarget.classList.add(hasMatch ? "correct" : "wrong");
  // event.currentTarget.style.backgroundColor = hasMatch ? "lightgreen" : "pink";
  // event.currentTarget.style.color = hasMatch ? "green" : "red";

  //TODO: Vérifier si l'utilisateur peut encore jouer, si il gagne ou il perd
  if (currentFailures >= MAX_TRIES) {
    showAnswer("Défaite");

    //TODO: Désactiver les boutons
    toggleLetterButtons(true);
  } else if (areIdentficalNoCaseNoAccents(foundWord, selectedWord)) {
    alert("victoire");
    toggleLetterButtons(true);
    //TODO: Désactiver les boutons
  } else {
    //Jouer encore
  }
}
//#endregion Events
//#endregion Functions
