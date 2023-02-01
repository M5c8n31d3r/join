setURL("https://gruppe-445.developerakademie.net/smallest_backend_ever/");

const users = new Array();
const tasks = new Array();

// ID of the user. 0 for guest
let userLogIn = NULL;

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
 * Load the data from the backend and convert to JSON-ARRAY
 * @param {STRING} load -> Key of the data in Backend
 * @returns array of JSON-Data
 */
// async function loadBackend(load) {
//   let loaded = await backend.getItem(load);
//   let data = await JSON.parse(loaded);
//   return data;
// }
