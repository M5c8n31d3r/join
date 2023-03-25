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
 * check the requiered fields and show the information in HTML-file
 * @param {OBJECT} task -> one task
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
 * get the selected category from drop-down-menu
 * @param {INT} id -> ID of the category
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
 * Show and hide the drop-down-menus
 * @param {STRING} listName HTML-Name of the Drop-Down-List
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
 * show input field for a new category
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
 * Save new category to the backend
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
    document.getElementById("subtask-alert").classList.remove("display-none");
  } else {
    document.getElementById("subtask-alert").classList.add("display-none");
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
