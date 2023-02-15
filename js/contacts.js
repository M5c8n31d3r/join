let letterlist = [];

async function initContacts() {
  await includeHTML();
  await loadDataFromServer();
  renderContacts();
}

function renderContacts() {
  let contactlist = document.getElementById("contactlist");
  contactlist.innerHTML = "";
  letterlist = [];
  createLetterlist();
  renderLetterGroup(contactlist);
  renderContact();
}

function createLetterlist() {
  for (let i = 1; i < users.length; i++) {
    const user = users[i];
    pushFirstLetter(user);
  }
}

function renderLetterGroup(contactlist) {
  letterlist.sort();
  for (let i = 0; i < letterlist.length; i++) {
    const letter = letterlist[i];
    contactlist.innerHTML += `<div id=letter-${letter} class="cl-letters">${letter}</div>
    <div id=group-${letter}></div>
    `;
  }
}

function renderContact() {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let firstLetter = getFirstLetter(user);
    for (let j = 0; j < letterlist.length; j++) {
      const letterLetterlist = letterlist[j];
      if (letterLetterlist == firstLetter) {
        document.getElementById(`group-${firstLetter}`).innerHTML +=
          renderSingleContact(user);
      }
    }
  }
}

// ToDo: Wird diese Funktion noch benötigt? Wofür war die gedacht?
function checkForLetter() {}

function renderSingleContact(user) {
  return `
    <div class="cl-contact center-row pointer" onclick="showDetails(${
      user.id
    })">
      <div class="cl-contact-left center">${getFirstLetters(user)}</div>
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

function getFirstLetter(user) {
  return user["name"].charAt(0);
}

function pushFirstLetter(user) {
  if (letterlist.indexOf(getFirstLetter(user))) {
    letterlist.push(getFirstLetter(user));
  }
}

function getFirstLetters(user) {
  let firstLetters = user["name"]
    .split(" ")
    .map((user) => user.charAt(0))
    .join("");
  return firstLetters;
}

function showDetails(id) {
  let details = document.getElementById("details");
  let contactlist = document.getElementById("contactlist");
  let btn = document.getElementById("btn");

  contactlist.classList.add("display-none");
  details.classList.remove("display-none");
  btn.classList.add("display-none");

  renderDetails(id);
}

function renderDetails(id) {
  let details = document.getElementById("details");
  details.innerHTML = /*html */ `
  <h1>Contacts</h1>
  <img src="../assets/img/icons/icon-arrow-back-black.svg" onclick="returnContacts()">
  <div>Better with a team</div>
  <hr id="hr">
  <div class="cl-contact-left center">${getFirstLetters(users[id])}</div>
  <div class="cl-contact-right center-column gap-s">
    <div class="cl-contact-name">${users[id].name}</div>
    <a onclick="addTask()">
      <img src="../assets/img/icons/icon-plus.svg" alt="">
      Add Task
    </a>
  </div>
  <div>Contact Information</div>
  <h3>Email</h3>
  <a href="mailto:${users[id].email}" class="cl-contact-email font-lightblue">${
    users[id].email
  }</a>
  <h3>Mobil</h3>
  <div>${users[id].phone}</div>
  `;
}

function addEditUser(id, edit) {}

function returnContacts() {
  let contactlist = document.getElementById("contactlist");
  let details = document.getElementById("details");
  let addEditContact = document.getElementById("add-edit-contact");
  let btn = document.getElementById("btn");

  contactlist.classList.remove("display-none");
  details.classList.add("display-none");
  addEditContact.classList.add("display-none");
  btn.classList.remove("display-none");

  renderContacts();
}

function addTask() {
  alert("Hier entsteht ein neuer Task!");
}
