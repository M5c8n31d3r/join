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
 * Generate List of contacts
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
 * Render the contact-information of a single user
 * @param {Object} user one user of users-array
 * @returns HTML-Object
 */
function renderSingleContact(user, classCounter) {
  return `
    <div id="${user.id}" class="cl-contact flex center-row pointer" onclick="showDetails(${user.id})">
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
 * Return the first letter of the name
 * @param {Object} user one user of users-array
 * @returns CHAR
 */
function getFirstLetter(user) {
  return user["name"].charAt(0);
}

/**
 * render the detail-screen of user-informations
 * @param {INT} id ID of the user
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
      <img style= "cursor: pointer" src="../assets/img/icons/icon-to-do.svg">
      Edit Contact
    </div>
  </div>
  <p class="font-16 bold">Email</p>
  <a href="mailto:${
    users[id].email
  }" class="font-16 contacts-text font-lightblue">${users[id].email}</a>
  <p class="font-16 bold">Phone</p>
  <p class="contacts-text">${users[id].phone}</p>
  <button class="btn-delete-contact flex center" onclick="deleteUser(${id})"><img style= "cursor: pointer" class="icon-white"  src="../assets/img/icons/icon-delete.svg"></button>
  <button class="btn-edit-contact mobile flex center" onclick="addEditUser(${id}, ${true})"><img style= "cursor: pointer" class="icon-white" src="../assets/img/icons/icon-to-do.svg"></button>
  `;
}

/**
 * Generate AddTask-Button only for users, not for contacts
 * @param {INT} id id of the user
 * @returns
 */
function renderAddTaskButton(id) {
  if (users[id].isUser) {
    return /*html */ `
  <a id="${id}" onclick="addUserToTask(${id})" class="contact-details-add-task flex gap-m center-row">
        <img src="../assets/img/icons/icon-plus.svg">
        Add Task
      </a>
  `;
  } else {
    return /* html */ `
      <div class="contact-details-add-task flex gap-m center-row">
        Add Task only for Users.
        </div>`;
  }
}

/**
 * Render the Card for edditing and adding contacts
 * @param {INT*} id ID of the user
 * @param {STRING} headline Headline of edit-card
 * @param {STRING} underheadline Underheadline of edit-card
 * @param {STRING} icon URL of the icon / Initials of the user
 * @param {STRING} checkout Button-text
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
      <img style="cursor:pointer" src="../assets/img/icons/icon-x.svg" />
      </div>
      <div class="nc-card-top">
        <img class="nc-logo desktop" src="../assets/img/logos/logo-white.png" />
        <h1>${headline}</h1>
        <h2>${underheadline}</h2>
        <div class="blue-line-h"></div>
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
            <input type="text" id="edit-phone" value="${
              id == users.length ? "" : users[id].phone
            }" placeholder="Phonenumber">
            <img src="../assets/img/icons/icon-phone.svg" />
          </div>
          <div class="nc-btn-box flex-row center gap">
            <button class="nc-btn-light flex center btn-line desktop" onclick="toggleVisibility('add-edit-contact')">Cancel <img class="line-btn" src="../assets/img/icons/icon-x.svg"></button>
            <button class="nc-btn" onclick="save(${id})">${checkout} <img src="../assets/img/icons/icon-check.svg"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}
