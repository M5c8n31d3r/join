/**
 * This File contains all functions, which are used in different files.
 */

setURL("https://gruppe-445.developerakademie.net/smallest_backend_ever/");

const users = [];
const tasks = [];

// ID of the user. 0 for guest
let userLogIn = null;

/**
 * Load the templates into the singe pages
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * Load all Data from the Backend an push it in the two arrays for users and tasks
 */
async function loadDataFromServer() {
  let download = await downloadFromServer();
  download = await JSON.parse(download);

  for (let i = 0; i < download.users.length; i++) {
    users.push(download.users[i]);
  }

  for (let i = 0; i < download.tasks.length; i++) {
    tasks.push(download.tasks[i]);
  }
}

/**
 *
 * @param {INT} id -> ID of the edited user
 *
 * Save the initials to the user-object
 */
function setInitials(id) {
  let firstLetters = users[id].name
    .split(" ")
    .map((user) => user.charAt(0))
    .join("");

  users[id].initials = firstLetters;
}
