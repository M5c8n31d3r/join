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

  <div class="pointer" onclick="addEditUser(${id}, ${true})">
    EDIT
  </div>
  `;
}

function addEditUser(id, edit) {
  let details = document.getElementById("details");
  let contactlist = document.getElementById("contactlist");
  let btn = document.getElementById("btn");
  let editUser = document.getElementById("add-edit-contact");
  let headline = "";
  let underheadline = "";
  let icon = "";
  let checkout = "";

  contactlist.classList.add("display-none");
  details.classList.add("display-none");
  btn.classList.add("display-none");
  editUser.classList.remove("display-none");

  if (edit) {
    headline = "Edit contact";
    underheadline = "";
    icon = getFirstLetters(users[id]);
    checkout = "Save";
  } else {
    headline = "Add contact";
    underheadline = "Tasks are better with a team!";
    icon = '<img src="../assets/img/icons/icon-name.svg">';
    id = users.length;
    checkout = "Create contact";
  }
  renderAddEditUser(id, headline, underheadline, icon, checkout);
}

function renderAddEditUser(id, headline, underheadline, icon, checkout) {
  let contact = document.getElementById("add-edit-contact");
  contact.innerHTML = /*html */ `
  <div class="head">
    <h1>${headline}</h1>
    <h2>${underheadline}</h2>
    <hr id="hr">
    <div class="cl-contact-left center">${icon}</div>
  </div>
  <div class="contact-detail">
    <input type="text" value="${
      id == users.length ? "" : users[id].name
    }" placeholder="Name">
    <input type="email" value="${
      id == users.length ? "" : users[id].email
    }" placeholder="Email">
    <input type="phone" value="${
      id == users.length ? "" : users[id].phone
    }" placeholder="Phonenumber">
    <button class="login-btn" onclick="save()">${checkout}</button>
  </div>
  `;
}

function save() {
  alert("Jetzt muss ich die Scheiße nur noch speichern...");
}

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
