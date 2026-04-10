let timer;
window.onload = () => {
  onTimerTick();
  init();
};
/**
 * Initialisation des éléments de la page.
 */
function init() {
  timer = setInterval(() => onTimerTick(), 1000);
  setTimeout(() => onTimePassed(), 5000);
}
/**
 *
 */
function onTimerTick() {
  const dt = new Date();
  let date = new Intl.DateTimeFormat("fr-BE", {
    dateStyle: "full", //Vendredi 10 Avril 2026
    timeStyle: "medium", //à 13:30:33
    timeZone: "Europe/Brussels",
  }).format(dt);
  const DateParts = date.split(" ");
  date = `${DateParts[0].charAt(0).toUpperCase() + DateParts[0].slice(1)} ${DateParts[1]} ${DateParts[2].charAt(0).toUpperCase() + DateParts[2].slice(1)}`;
  for (let word = 3; word < DateParts.length; word++) {
    date += ` ${DateParts[word]}`;
  }
  date = date.replace("à", "-");
  document.querySelector("#DateTime").innerHTML = date;
}
function onTimePassed() {
  document.querySelector("footer").classList.add("active");
}
