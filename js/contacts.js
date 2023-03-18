// Global variables
let letterlist = [];

/**
 * Initialisation after loading the page
 */
async function initContacts() {
  await includeHTML();
  await loadDataFromServer();
  setActive("nav-contacts");
  renderContacts();
}

/**
 * Render the whole contactlist
 */
function renderContacts() {
  let contactlist = document.getElementById("contactlist");
  contactlist.innerHTML = "";
  letterlist = [];
  createLetterlist();
  renderLetterGroup(contactlist);
  renderContact();
}

/**
 * Create the List of Firstletters
 */
function createLetterlist() {
  for (let i = 1; i < users.length; i++) {
    if (letterlist.indexOf(getFirstLetter(users[i]))) {
      letterlist.push(getFirstLetter(users[i]));
    }
  }
}

/**
 *
 * @param {OBJECT} contactlist HTML-Object
 * Render the Letters for grouping the contacts
 */
function renderLetterGroup(contactlist) {
  letterlist.sort();
  for (let i = 0; i < letterlist.length; i++) {
    contactlist.innerHTML += `<div id=letter-${letterlist[i]} class="cl-letters">${letterlist[i]}</div>
    <div id=group-${letterlist[i]} class="cl-group"></div>
    `;
  }
}

/**
 * ToDO Beschreibung ergänzen
 */
function renderContact() {
  for (let i = 0; i < users.length; i++) {
    let firstLetter = getFirstLetter(users[i]);
    for (let j = 0; j < letterlist.length; j++) {
      const letterLetterlist = letterlist[j];
      if (letterLetterlist == firstLetter) {
        document.getElementById(`group-${firstLetter}`).innerHTML +=
          renderSingleContact(users[i], i % 4);
      }
    }
  }
}

/**
 *
 * @param {Object} user one user of users-array
 * @returns HTML-Object
 * Render the contact-information of a single user
 */
function renderSingleContact(user, classCounter) {
  return `
    <div id="${user.id}" class="cl-contact center-row pointer" onclick="showDetails(${user.id})">
      <div class="cl-contact-left initials initials-bg${classCounter} center">${user.initials}</div>
      <div class="cl-contact-right center-column gap-s">
        <div class="cl-contact-name">${user["name"]}</div>
        <a
          href="mailto:${user["email"]}"
          class="cl-contact-email font-lightblue"
          >${user["email"]}</a
        >
      </div>
    </div>`;
}

/**
 *
 * @param {Object} user one user of users-array
 * @returns CHAR
 * Return the first letter of the name
 */
function getFirstLetter(user) {
  return user["name"].charAt(0);
}

/**
 * @param {INT} id ID of the user
 * Hide the contactlist and show the details
 */
function showDetails(id) {
  let details = document.getElementById("details");
  let columnRight = document.getElementById("contacts-col-r");

  details.classList.remove("display-none");
  columnRight.style = "display: unset";

  setActiveUser(id);
  renderDetails(id, id % 4);
}

/**
 * Change class of active user
 * @param {INT} id ID of active user
 */
function setActiveUser(id) {
  for (let i = 1; i < users.length; i++) {
    document.getElementById(i).classList.remove("cl-contact-active");
  }
  document.getElementById(id).classList.add("cl-contact-active");
}

/**
 *
 * @param {INT} id ID of the user
 * render the detail-screen of user-informations
 *
 * TODO addTask noch programmieren
 */
function renderDetails(id, classCounter) {
  let details = document.getElementById("details");
  details.innerHTML = /* html */ `
  <img class="back-arrow" src="../assets/img/icons/icon-arrow-back-black.svg" onclick="returnContacts()">
  <div class="contact-details-main flex center-row">
    <div class="cl-contact-left initials-contact-medium initials-bg${classCounter} center">${
    users[id].initials
  }</div>
    <div class="cl-contact-right center-column gap-s">
      <div class="contact-details-name">${users[id].name}</div>
      ${renderAddTaskButton(id)}      
    </div>
  </div>
  <div class="flex center-row gap-xl">
    <p class="font-21">Contact Information</p>
    <div class="contact-details-edit desktop flex center-row gap-s font-16 pointer" onclick="addEditUser(${id}, ${true})">
      <img src="../assets/img/icons/icon-to-do.svg">
      Edit Contact
    </div>
  </div>
  <p class="font-16 bold">Email</p>
  <a href="mailto:${
    users[id].email
  }" class="font-16 contacts-text font-lightblue">${users[id].email}</a>
  <p class="font-16 bold">Phone</p>
  <p class="contacts-text">${users[id].phone}</p>
  <button class="btn-delete-contact flex center" onclick="deleteUser(${id})"><img class="icon-white" src="../assets/img/icons/icon-delete.svg"></button>
  <button class="btn-edit-contact mobile flex center" onclick="addEditUser(${id}, ${true})"><img class="icon-white" src="../assets/img/icons/icon-to-do.svg"></button>
  `;
}

function renderAddTaskButton(id) {
  if (users[id].isUser) {
    return /*html */ `
  <a id="${id}" onclick="addUserToTask(${id})" class="contact-details-add-task flex gap-m center-row">
        <img src="../assets/img/icons/icon-plus.svg">
        Add Task
      </a>
  `;
  } else {
    return "";
  }
}

function addUserToTask(id) {
  selectedUsers.push(id);
  renderSelectedUsers();
  document
    .getElementById("save-task-button-mobile")
    .setAttribute("onClick", `saveTask("ToDo")`);
  document
    .getElementById("save-task-button-desktop")
    .setAttribute("onClick", `saveTask("ToDo")`);
  addTask();
}

/**
 *
 * @param {INT} id
 * @param {BOOLEAN} edit EDIT is TRUE, ADD is FALSE
 *
 * switch between add-user and edit-user
 */
function addEditUser(id, edit) {
  let details = document.getElementById("details");
  let contactlist = document.getElementById("contactlist");
  let btn = document.getElementById("btn");
  let headline = "";
  let underheadline = "";
  let icon = "";
  let checkout = "";

  // contactlist.classList.add("display-none");
  // details.classList.add("display-none");
  // btn.classList.add("display-none");
  toggleVisibility("add-edit-contact");

  if (edit) {
    headline = "Edit contact";
    underheadline = "";
    icon = users[id].initials;
    checkout = "Save";
  } else {
    headline = "Add contact";
    underheadline = "Tasks are better with a team!";
    icon = '<img src="../assets/img/icons/icon-name.svg">';
    id = users.length;
    checkout = "Create contact";
  }
  renderAddEditUser(id, headline, underheadline, icon, checkout, id % 4);
}

/**
 *
 * @param {INT*} id ID of the user
 * @param {STRING} headline Headline of edit-card
 * @param {STRING} underheadline Underheadline of edit-card
 * @param {STRING} icon URL of the icon / Initials of the user
 * @param {STRING} checkout Button-text
 *
 * Render the Card for edditing and adding contacts
 */
function renderAddEditUser(
  id,
  headline,
  underheadline,
  icon,
  checkout,
  classCounter
) {
  let contact = document.getElementById("add-edit-contact");
  contact.innerHTML = /*html */ `
  <div class="nc-background ">
    <div class="nc-card animationFadeInBottom">
      <div class="nc-card-close" onclick="toggleVisibility('add-edit-contact')">
      <img src="../assets/img/icons/icon-x.svg" />
      </div>
      <div class="nc-card-top">
        <h1>${headline}</h1>
        <h2 class="desktop">${underheadline}</h2>
        <div class="mobile blue-line-h"></div>
      </div>
      <div class="nc-card-bottom">
      <div class="flex center">
          <div class="initials-contact-big nc-card-initials initials-bg${classCounter} center">${icon}</div>
        </div>
        <div class="contact-detail">
          <div class="input-login input-bar">
            <input type="text" required id="edit-name" value="${
              id == users.length ? "" : users[id].name
            }" placeholder="Name">
            <img src="../assets/img/icons/icon-name.svg" />
          </div>
          <div class="input-login input-bar">
            <input type="email" required id="edit-email" value="${
              id == users.length ? "" : users[id].email
            }" placeholder="Email">
            <img src="../assets/img/icons/icon-email.svg" />
          </div>
          <div class="input-login input-bar">
            <input type="phone" id="edit-phone" value="${
              id == users.length ? "" : users[id].phone
            }" placeholder="Phonenumber">
            <img src="../assets/img/icons/icon-phone.svg" />
          </div>
          <div class="flex center">
            <button class="nc-btn" onclick="save(${id})">${checkout}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function toggleVisibility(id) {
  let card = document.getElementById(id);
  if (card.classList.contains("display-none")) {
    card.classList.remove("display-none");
  } else {
    card.classList.add("display-none");
  }
}

/**
 *
 * @param {INT} id ID of the user
 * Push the user input to users-array and save the array in the backend
 */
function save(id) {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const phone = document.getElementById("edit-phone").value;

  //Save a new user
  if (id == users.length) {
    if (!getUserExist(email)) {
      let user = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        isUser: false
      };
      users.push(user);
    } else {
      errorMSG();
    }
  } else {
    //edit an existing user
    if (users[id].email == email) {
      saveExistingUser(id, name, email, phone);
    } else {
      if (!getUserExist(email)) {
        saveExistingUser(id, name, email, phone);
      } else {
        errorMSG();
      }
    }
  }
  setInitials(id);
  backend.setItem("users", users);
  returnContacts();
}

/**
 *
 * @param {INT} id
 * @param {STRING} name Name of the user
 * @param {STRING} email Email of the user
 * @param {STRING} phone Phonenumber of the user
 *
 * override user-details with input data
 */
function saveExistingUser(id, name, email, phone) {
  users[id].name = name;
  users[id].email = email;
  users[id].phone = phone;
}

/**
 * Errormassage if the mail is used otherwise
 */
function errorMSG() {
  // !Error erstellen
  alert("Email schon vergeben");
}

/**
 * ToDo Beschreibung erstellen
 */
function returnContacts() {
  let contactlist = document.getElementById("contactlist");
  let details = document.getElementById("details");
  let addEditContact = document.getElementById("add-edit-contact");
  let btn = document.getElementById("btn");
  let columnRight = document.getElementById("contacts-col-r");

  contactlist.classList.remove("display-none");
  details.classList.add("display-none");
  addEditContact.classList.add("display-none");
  btn.classList.remove("display-none");
  columnRight.style = "display: none";

  // document.getElementById(id).classList.remove(""); // TODO CLASS WITH DARK BACKGROUND

  renderContacts();
}

/**
 * Add a new Task
 *
 * ToDo -> open the overlay template
 */
function addTask() {
  document.getElementById("addtask-dialog").classList.remove("display-none");
}

/**
 * Delete one User
 * @param {INT} id Item to delete
 */
function deleteUser(id) {
  users.splice(id, 1);
  for (let i = 0; i < users.length; i++) {
    users[i].id = i;
  }
  backend.setItem("users", users);
  returnContacts();
}
