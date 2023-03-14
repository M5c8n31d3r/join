/**
 * This File contains all functions, which are used in different files.
 */

setURL("https://gruppe-445.developerakademie.net/smallest_backend_ever/");

// Arrays for the Data
const users = [];
const tasks = [];
const categories = [];

// ID of the user. 0 for guest
let userLogIn = null;

/**
 * Load the templates into the single pages
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * Load all Data from the Backend an push it in the two arrays for users, tasks and categories
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

  for (let i = 0; i < download.categories.length; i++) {
    categories.push(download.categories[i]);
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

/**
 *
 * @param {STRING} email -> Email which is to check in the users-Array
 * @returns the ID of the user, which fit to the email. If no user was found, it returns FALSE
 */
function getUserExist(email) {
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (email.toLowerCase() == users[i].email) {
        return i;
      }
    }
  } else {
    return false;
  }
}

/**
 *
 * @param {STRING} id -> ID of the active menu
 * Set the active menu for visual feedback in menubar
 */
function setActive(id) {
  let activeItem = document.getElementById(id);

  activeItem.classList.add("nav-item-active");
}

/**
 *
 * @param {STRING} elementID -> ID of the element, which should be displayed
 * Show the alert-massages
 */
function showAlert(elementID) {
  document.getElementById(elementID).classList.remove("display-none");
}

/**
 *
 * @param {STRING} page -> The URL to the page, which will load
 */
function loadPageWithDelay(page) {
  let timeout = setTimeout(
    function (page) {
      window.location.assign(page);
    },
    2000,
    page
  );
}

/**
 *
 * @param {INT} UNIX_timestamp Time as Unix-Time in seconds since 01.01.1970
 * @returns {STRING} Time as STRING -> MM DD, YYYY
 *
 * Convert the Unix-time to human readable timestamp
 */
function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp);
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  return month + " " + date + ", " + year;
}

/**
 * Logout and reset currentUser
 */
async function logOut() {
  currentUser = [];
  await saveOnServer("currentUser", currentUser);
  window.location.href = "./index.html";
}
