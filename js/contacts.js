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
    if (letterlist.indexOf(getFirstLetter(users[i])) == -1) {
      letterlist.push(getFirstLetter(users[i]));
    }
  }
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
 * Preset the user as assigned to
 * @param {INT} id ID of the selected-user
 */
function addUserToTask(id) {
  selectedUsers.push(id);
  renderSelectedUsers();
  document
    .getElementById("save-task-button-mobile")
    .setAttribute("onClick", `saveTask("ToDo")`);
  document
    .getElementById("save-task-button-desktop")
    .setAttribute("onClick", `saveTask("ToDo")`);
  loadCategories();
  loadUserList();
  getToday();
  addTask();
}

/**
 * switch between add-user and edit-user
 * @param {INT} id id of the selected-user
 * @param {BOOLEAN} edit EDIT is TRUE, ADD is FALSE
 */
function addEditUser(id, edit) {
  let headline = "";
  let underheadline = "";
  let icon = "";
  let checkout = "";

  toggleVisibility("add-edit-contact");

  if (edit) {
    headline = "Edit contact";
    underheadline = "";
    icon = users[id].initials;
    checkout = "Save";
  } else {
    headline = "Add contact";
    underheadline = "Tasks are better with a team!";
    icon =
      '<img class="nc-placeholder" src="../assets/img/icons/icon-name.svg">';
    id = users.length;
    checkout = "Create contact";
  }
  renderAddEditUser(id, headline, underheadline, icon, checkout, id % 4);
}

/**
 * Push the user input to users-array and save the array in the backend
 * @param {INT} id ID of the user
 */
function save(id) {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const phone = document.getElementById("edit-phone").value;

  //Save a new user
  if (id == users.length) {
    if (!getUserExist(email) && name != "") {
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
    editUser(id);
  }
  setInitials(id);
  backend.setItem("users", users);
  returnContacts();
}

/**
 * Save the new input for a existing user
 * @param {INT} id ID of the user
 */
function editUser(id) {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const phone = document.getElementById("edit-phone").value;

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

/**
 * override user-details with input data
 * @param {INT} id
 * @param {STRING} name Name of the user
 * @param {STRING} email Email of the user
 * @param {STRING} phone Phonenumber of the user
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
  alert("Es ist ein Fehler aufgetreten!");
}

/**
 * Go back to contactlist
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

  renderContacts();
}

/**
 * Add a new Task
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
