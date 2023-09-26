/**
 * This File contains all functions, which are used in different files.
 */

// setURL("https://michael-schneider.developerakademie.net/smallest_backend_ever");
setURL("https://michaelschneider.dev/smallest_backend_ever");

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
 * Changes the visibility of an element
 * @param {id} ID of the element to be hidden or shown
 */
function toggleVisibility(id) {
  let element = document.getElementById(id);
  if (element.classList.contains("display-none")) {
    element.classList.remove("display-none");
  } else {
    element.classList.add("display-none");
    // $("body").removeClass("no-scroll");
  }
}

/**
 * The function hides an HTML element by adding a "display-none" class to it.
 * @param id - The parameter "id" is a string representing the id attribute of an HTML element that
 * needs to be hidden. The function uses the getElementById method to select the element with the
 * specified id and then adds the "display-none" class to it, which sets the display property to "none"
 * in CSS
 */
function hideElement(id) {
  document.getElementById(id).classList.add("display-none");
}

/**
 * The function removes the "display-none" class from an HTML element with a specified ID.
 * @param id - The parameter "id" is a string that represents the ID of an HTML element that we want to
 * show on the webpage. The function uses the document.getElementById() method to select the element
 * with the specified ID and then removes the "display-none" class from its classList property. This
 * will make the
 */
function showElement(id) {
  document.getElementById(id).classList.remove("display-none");
}

/**
 * Show the alert-massages
 * @param {STRING} elementID -> ID of the element, which should be displayed
 */
function showAlert(elementID) {
  document.getElementById(elementID).classList.remove("display-none");
}
/**
 * Hide the alert-massages
 * @param {STRING} elementID -> ID of the element, which should be hide
 */
function hideAlert(elementID) {
  document.getElementById(elementID).classList.add("display-none");
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
 * Fill the User-Data-Inputfields with data in localStorage
 */
function loadDataFromLocalStorage() {
  if (localStorage.getItem("user")) {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    document.getElementById("email").value = user.email;
    document.getElementById("password").value = user.password;
    document.getElementById("rememberme").checked = true;
  }
}

/**
 * Toggles the visibility of the context menu
 * @param {Object} ctxMenuId The ID of the context menu
 *
 *
 */
function toggleContextMenu(ctxMenuId) {
  const ctxMenu = document.getElementById(ctxMenuId);

  if (ctxMenu.classList.contains("display-none")) {
    showCtxMenu(ctxMenu);
  } else {
    hideCtxMenu(ctxMenu);
  }
}

/**
 * Shows the context menu
 * @param {Object} ctxMenu The context menu
 */
function showCtxMenu(ctxMenu) {
  ctxMenu.classList.remove("display-none");
  setTimeout(() => {
    ctxMenu.classList.add("context--show");
  }, 1);
}

/**
 * Hides the context menu
 * @param {Object} ctxMenu The context menu
 */
function hideCtxMenu(ctxMenu) {
  ctxMenu.classList.remove("context--show");
  setTimeout(() => {
    ctxMenu.classList.add("display-none");
  });
}

/**
 * Logout and reset currentUser
 *
 * ! DER LOCALSTORAGE MUSS GECLEANT WERDEN, NICHTS AUF DEM SERVER
 */
async function logOut() {
  userLogIn = null;
  localStorage.setItem("userLogIn", userLogIn);
  loadPageWithDelay("../index.html");
}
