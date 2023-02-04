let letterlist = [];

async function initContacts() {
  await includeHTML();
  await loadContacts();
  renderContacts();
}

async function loadContacts() {
  let download = await downloadFromServer();
  download = await JSON.parse(download);
  users.splice(0, users.length);
  for (let i = 1; i < download.users.length; i++) {
    users.push(download.users[i]);
  }
}

function renderContacts() {
  let contactlist = document.getElementById("contactlist");
  contactlist.innerHTML = "";
  createLetterlist();
  renderLetterGroup(contactlist);
  renderContact();
}

function createLetterlist() {
  for (let i = 0; i < users.length; i++) {
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

function checkForLetter() {}

function renderSingleContact(user) {
  return `
    <div class="cl-contact center-row">
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
