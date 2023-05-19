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
 * The function saves a task with various properties and checks for input validation.
 * @param [state=ToDo] - The state parameter is a string that represents the current state of the task
 * being saved. It has a default value of "ToDo" which means that if no state is provided, the task
 * will be saved in the "ToDo" state. However, if a different state is provided as an argument, the
 */
function saveTask(state = "ToDo") {
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
    state: state,
    subtask: subtasks
  };
  checkInputs(task);
}

/**
 * The function checks if the task input has a title, description, and a valid due date before adding
 * it to the tasks array and storing it in the backend.
 * @param task - The parameter "task" is an object that contains information about a task, including
 * its title, description, and due date. The function checks if all of these properties are filled out
 * and if the due date is a valid number before adding the task to an array called "tasks" and storing
 * it in
 */
function checkInputs(task) {
  if (
    task.title != "" &&
    task.description != "" &&
    !isNaN(task.dueDate) &&
    selectedPriority != null &&
    document.getElementById("category-input").value != ""
  ) {
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
 * The function checks for alerts on various task properties and toggles them accordingly.
 * @param task - The task object that contains the information to be checked for alerts.
 */
function checkAlert(task) {
  let cat = document.getElementById("category-input").value;
  toggleAlert(task, "title", "title-alert");
  toggleAlert(task, "description", "description-alert");
  toggleAlert(task, "assignedTo", "assigned-to-alert");
  if (cat == "") {
    showAlert("category-alert");
  } else {
    hideAlert("category-alert");
  }
  if (selectedPriority == null) {
    showAlert("prio-alert");
  } else {
    hideAlert("prio-alert");
  }
  if (isNaN(task.dueDate)) {
    showAlert("due-date-alert");
  } else {
    hideAlert("due-date-alert");
  }
}

/**
 * The function checks if a task input is empty or not a number and shows or hides an alert
 * accordingly.
 * @param task - It is a variable that likely contains an object or array with information about a
 * task.
 * @param input - The name of the input field being checked for a valid value.
 * @param inputId - inputId is a string parameter that represents the ID of the HTML element where the
 * alert message will be displayed.
 */
function toggleAlert(task, input, inputId) {
  if (task[input] == "") {
    showAlert(inputId);
  } else {
    hideAlert(inputId);
  }
}

/**
 * get the selected category from drop-down-menu
 * @param {INT} id -> ID of the category
 */
function selectCategory(id) {
  let filledCategory = document.getElementById("filled-category");
  filledCategory.innerHTML = fillCatergory(id);
  filledCategory.classList.remove("display-none");
  document.getElementById("category-input").value = categories[id].name;
  hideElement("category-input");
  hideElement("new-category-colors");
  toggleDropdown("category");
}

/**
 * The function toggles the display of a dropdown list based on its current state.
 * @param listName - The parameter `listName` is a string that represents the name of the dropdown list
 * that needs to be toggled.
 */
function toggleDropdown(listName) {
  if (
    document
      .getElementById(`dropdown-list-${listName}`)
      .classList.contains("display-none")
  ) {
    showElement(`dropdown-list-${listName}`);
  } else {
    hideElement(`dropdown-list-${listName}`);
  }
}

/**
 * show input field for a new category
 */
function newCategory() {
  let categoryInput = document.getElementById("category-input");
  showElement("new-category-colors");
  showElement("dropdown-accept");
  hideElement("category-dropdown-arrow");
  hideElement("filled-category");
  categoryInput.classList.remove("display-none");
  categoryInput.disabled = false;
  categoryInput.value = "";
  categoryInput.select();
  toggleDropdown("category");
}

/**
 * This function clears input fields and toggles the visibility of certain elements.
 */
function clearInput() {
  hideElement("new-category-colors");
  hideElement("category-input");
  hideElement("dropdown-accept");
  showElement("category-dropdown-arrow");
  showElement("filled-category");
  toggleDropdown("category");
}

/**
 * Save new category to the backend
 */
function saveNewCategory() {
  let newCatValue = document.getElementById("category-input").value;
  let newCatColor =
    document.getElementById("new-category-color").style.backgroundColor;
  categories.push({
    id: categories.length,
    name: newCatValue,
    color: newCatColor
  });
  backend.setItem("categories", categories);
  loadCategories();
  let filledCategory = document.getElementById("filled-category");
  filledCategory.innerHTML = fillCatergory(categories.length - 1);
  filledCategory.classList.remove("display-none");
  hideElement("category-input");
  hideElement("new-category-colors");
  hideElement("dropdown-accept");
  showElement("category-dropdown-arrow");
}

/**
 * add a color to the new category
 * @param {STRING} color CSS-Color for the new category
 */
function addNewCatergoryColor(color) {
  let selectedColor = color;
  document.getElementById(
    "new-category-color"
  ).style.backgroundColor = `var(${selectedColor}`;
}

/**
 * select a user for assignement
 * @param {INT} id ID of the user
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
 * Get the initials of the user
 * @param {INT} selectedUser ID of the selected user
 * @returns {STRING} The initials of the selected user
 */
function renderSelectedUserDetails(selectedUser) {
  const user = users.find((n) => n.id === selectedUser);
  return user.initials;
}

/**
 * new contact for assignement
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
 * set the global variable for priority
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
 */
function addSubtask() {
  let subtask = document.getElementById("task-subtask");
  if (subtask.value == "") {
    showElement("subtask-alert");
  } else {
    hideElement("subtask-alert");
    subtasks.push({ description: subtask.value, done: 0 });
    subtask.value = "";
    renderSubtasks();
  }
}

/**
 * event-listener on 'Enter'-key for adding subtask
 */
function addSubtaskEnter() {
  let input = document.getElementById("task-subtask");
  input.addEventListener("keydown", (e) => {
    if (input) {
      if (e.key === "Enter" && input.value) {
        addSubtask();
      }
    }
  });
}
