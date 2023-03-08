// Global variables
let today = new Date().toISOString().split("T")[0];
let selectedUsers = [];
let selectedCategory = {};
let selectedPriority = null;
let subtasks = [];

/**
 * Initialisation after loading the page
 */
async function initAddTask() {
  await includeHTML();
  await loadDataFromServer();
  loadCategories();
  loadUserList();
  getToday();
  setActive("nav-add-task");
  // activeSummaryNavLink();
}

/**
 * Save the input in a task-object and push the task to the tasks-array
 * saves the tasks-array in the backend
 */
function saveTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  let task = {
    id: tasks.length,
    title: title,
    description: description,
    priority: selectedPriority,
    category: selectedCategory,
    assignedTo: selectedUsers,
    dueDate: Date.parse(document.getElementById("task-due-date").value),
    state: "ToDo",
    subtask: subtasks
  };

  if (task.title != "" && task.description != "" && !isNaN(task.dueDate)) {
    tasks.push(task);
    backend.setItem("tasks", tasks);
    showTaskAddedInfobox();
  } else {
    checkAlert(task);
  }
}

/**
 * Show the infobox for 'Task added'
 */
function showTaskAddedInfobox() {
  document
    .getElementById("task-added-infobox")
    .classList.remove("display-none");
  loadPageWithDelay("./board.html");
}

/**
 *
 * @param {OBJECT} task -> one task
 * check the requiered fields and show the information in HTML-file
 */
function checkAlert(task) {
  console.log(task);
  if (task.title == "") {
    showAlert("title-alert");
  }
  if (task.description == "") {
    showAlert("description-alert");
  }
  if (isNaN(task.dueDate)) {
    showAlert("due-date-alert");
  }
}

/**
 * Generate the drop-down-list of categories
 */
function loadCategories() {
  let listItems = document.getElementById("category-list");
  listItems.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    listItems.innerHTML += `
      <div id='category-${categories[i].id}' onclick='selectCategory(${categories[i].id})' class="dropdown-item flex">
        <span class="category-name">${categories[i].name}</span>
        <div class="category-color" style="background-color: ${categories[i].color}"></div>
      </div>`;
  }
}

/**
 *
 * @param {INT} id -> ID of the category
 *
 * ToDo: hier noch prüfen
 */
function selectCategory(id) {
  let filledCategory = document.getElementById("filled-category");
  filledCategory.innerHTML = fillCatergory(id);
  filledCategory.classList.remove("display-none");
  document.getElementById("category-input").value = categories[id].name;
  document.getElementById("category-input").classList.add("display-none");
  document.getElementById("new-category-colors").classList.add("display-none");
  toggleDropdown("category");
}

/**
 *
 * @param {STRING} listName HTML-Name of the Drop-Down-List
 * Show and hide the drop-down-menus
 */
function toggleDropdown(listName) {
  let list = document.getElementById(`dropdown-list-${listName}`);
  if (list.classList.contains("display-none")) {
    list.classList.remove("display-none");
  } else {
    list.classList.add("display-none");
  }
}

/**
 * ToDo: hier noch prüfen
 */
function newCategory() {
  let categoryInput = document.getElementById("category-input");

  document
    .getElementById("new-category-colors")
    .classList.remove("display-none");
  categoryInput.classList.remove("display-none");
  document.getElementById("dropdown-accept").classList.remove("display-none");
  categoryInput.disabled = false;
  document
    .getElementById("category-dropdown-arrow")
    .classList.add("display-none");

  categoryInput.value = "";
  categoryInput.select();
  document.getElementById("filled-category").classList.add("display-none");
  toggleDropdown("category");
}

/**
 * Clear all user inputs
 */
function clearInput() {
  document.getElementById("new-category-colors").classList.add("display-none");
  document.getElementById("category-input").classList.add("display-none");
  document.getElementById("dropdown-accept").classList.add("display-none");
  document
    .getElementById("category-dropdown-arrow")
    .classList.remove("display-none");

  document.getElementById("filled-category").classList.remove("display-none");
  toggleDropdown("category");
}

/**
 * ToDo: hier noch prüfen
 */
function saveNewCategory() {
  let newCatValue = document.getElementById("category-input").value;
  let newCatColor =
    document.getElementById("new-category-color").style.backgroundColor;
  categories.push({
    id: categories.length + 1,
    name: newCatValue,
    color: newCatColor
  });
  backend.setItem("categories", categories);
  loadCategories();
  let filledCategory = document.getElementById("filled-category");
  filledCategory.innerHTML = fillCatergory(categories.length - 1);
  filledCategory.classList.remove("display-none");
  document.getElementById("category-input").classList.add("display-none");
  document.getElementById("new-category-colors").classList.add("display-none");
  document.getElementById("dropdown-accept").classList.add("display-none");
  document
    .getElementById("category-dropdown-arrow")
    .classList.remove("display-none");
}

/**
 *
 * @param {STRING} color CSS-Color for the new category
 *
 * ToDo: hier noch prüfen
 */
function addNewCatergoryColor(color) {
  let selectedColor = color;
  document.getElementById(
    "new-category-color"
  ).style.backgroundColor = `var(${selectedColor}`;
}

/**
 *
 * @param {INT} id ID of the category
 * @returns HTML-Code for the category in drop-down-menu
 *
 * ToDo: hier noch prüfen
 */
function fillCatergory(id) {
  selectedCategory = {
    id: id,
    name: categories[id].name,
    color: categories[id].color
  };
  return `
<div class="flex">
  <span>${categories[id].name}</span>
  <div class="category-color" style="background-color: ${categories[id].color}"></div>
</div>`;
}

/**
 * Generate the users for drop-down-menu "assigned to"
 * Just user which are user.isUser == true
 */
function loadUserList() {
  let listItems = document.getElementById("user-list");
  listItems.innerHTML = "";
  for (let i = 1; i < users.length; i++) {
    if (users[i].isUser) {
      let listItem = users[i];
      listItems.innerHTML += `
      <div id='user-${listItem.id}' onclick='selectUser(${listItem.id})' 
      class="dropdown-item flex space-between">
        <span class="assigned-to-name">${listItem.name}</span>
        <input style="width: unset" id="user-checkbox-${listItem.id}" 
        type="checkbox">
      </div>`;
    }
  }
}

/**
 *
 * @param {INT} id ID of the user
 * ToDo: hier noch prüfen
 */
function selectUser(id) {
  if (selectedUsers.indexOf(id) === -1) {
    selectedUsers.push(id);
    document.getElementById("user-checkbox-" + id).checked = true;
  } else {
    selectedUsers.splice(selectedUsers.indexOf(id), 1);
    document.getElementById("user-checkbox-" + id).checked = false;
  }
  renderSelectedUsers();
}

/**
 * Render the small circle with the initials of the selected useres
 */
function renderSelectedUsers() {
  let selectedUserList = document.getElementById("assigned-to-user");
  selectedUserList.innerHTML = "";
  for (let i = 0; i < selectedUsers.length; i++) {
    selectedUserList.innerHTML += `<div class="initials center">${renderSelectedUserDetails(
      selectedUsers[i]
    )}</div>`;
  }
}

/**
 *
 * @param {INT} selectedUser ID of the selected user
 * @returns {STRING} The initials of the selected user
 */
function renderSelectedUserDetails(selectedUser) {
  const user = users.find((n) => n.id === selectedUser);
  return user.initials;
}

/**
 * ToDo: hier noch prüfen
 */
function newAssignedToContact() {
  document.getElementById("assigned-to-user-input").disabled = false;
  document.getElementById("assigned-to-user-input").focus();
  toggleDropdown("assigned-to");
}

/**
 * Set the date in HTML-Due-Date-Dropdown to the actual date
 */
function getToday() {
  document.getElementById("task-due-date").setAttribute("min", today);
}

/**
 *
 * @param {INT} priority set the global variable for priority
 */
function setPrio(priority) {
  selectedPriority = priority;
}

/**
 * Clear all user inputs
 */
function clearAll() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-due-date").value = "";
  document.getElementById("category-input").value = "";
  document.getElementById("task-urgent").checked = false;
  document.getElementById("task-medium").checked = false;
  document.getElementById("task-low").checked = false;

  selectedUsers = [];
  selectedCategory = {};
  selectedPriority = null;
  subtasks = [];

  renderSelectedUsers();
  renderSubtasks();
}

/**
 * push the value of the input-field to the global-array of subtasks
 * ToDo: hier noch prüfen
 */
function addSubtask() {
  let subtask = document.getElementById("task-subtask");
  subtasks.push(subtask.value);
  subtask.value = "";
  renderSubtasks();
}

/**
 * render the list of subtasks
 */
function renderSubtasks() {
  let subtasks1 = document.getElementById("task-subtasks");
  subtasks1.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    subtasks1.innerHTML += `
    <div class="flex gap">
      <div class="flex">
        <input class="checkbox" type="checkbox" id="subtask-${i}">
      </div>
      <label for="subtask-${i}"> ${subtask}</label>
    </div>`;
  }
}
