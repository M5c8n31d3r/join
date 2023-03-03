let today = new Date().toISOString().split("T")[0];

let selectedUsers = [];
let selectedCategory = {};
let selectedPriority = null;
let subtasks = [];

async function initAddTask() {
  await includeHTML();
  await loadDataFromServer();
  loadCategories();
  loadUserList();
  getToday();
  setActive("nav-add-task");
  // activeSummaryNavLink();
}

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

  if (task.title != "" && task.description != "" && task.dueDate != NaN) {
    tasks.push(task);
    backend.setItem("tasks", tasks);
    // setTimeout(loadDelay, 1000);
  } else {
    alert("Pflichtfelder ausfüllen!!!");
  }
}

function loadDelay() {
  window.location.assign("./board.html");
}

function loadCategories() {
  let listItems = document.getElementById("category-list");
  listItems.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    let listItem = categories[i];
    listItems.innerHTML += `
      <div id='category-${categories[i].id}' onclick='selectCategory(${categories[i].id})' class="dropdown-item flex">
        <span class="category-name">${categories[i].name}</span>
        <div class="category-color" style="background-color: ${categories[i].color}"></div>
      </div>`;
  }
}

function selectCategory(id) {
  let filledCategory = document.getElementById("filled-category");
  filledCategory.innerHTML = fillCatergory(id);
  filledCategory.classList.remove("display-none");
  document.getElementById("category-input").value = categories[id].name;
  document.getElementById("category-input").classList.add("display-none");
  document.getElementById("new-category-colors").classList.add("display-none");
  toggleDropdown("category");
}

function toggleDropdown(listName) {
  let list = document.getElementById(`dropdown-list-${listName}`);
  if (list.classList.contains("display-none")) {
    list.classList.remove("display-none");
  } else {
    list.classList.add("display-none");
  }
}

function newCategory() {
  document
    .getElementById("new-category-colors")
    .classList.remove("display-none");
  document.getElementById("category-input").classList.remove("display-none");
  document.getElementById("dropdown-accept").classList.remove("display-none");
  document
    .getElementById("category-dropdown-arrow")
    .classList.add("display-none");

  document.getElementById("category-input").value = "";
  document.getElementById("category-input").select();
  document.getElementById("filled-category").classList.add("display-none");
  toggleDropdown("category");
}

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

function addNewCatergoryColor(color) {
  let selectedColor = color;
  document.getElementById(
    "new-category-color"
  ).style.backgroundColor = `var(${selectedColor}`;
}

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

function renderSelectedUsers() {
  let selectedUserList = document.getElementById("assigned-to-user");
  selectedUserList.innerHTML = "";
  for (let i = 0; i < selectedUsers.length; i++) {
    selectedUserList.innerHTML += `<div class="initials center">${renderSelectedUserDetails(
      selectedUsers[i]
    )}</div>`;
  }
}

function renderSelectedUserDetails(selectedUser) {
  const user = users.find((n) => n.id === selectedUser);
  return user.initials;
}

function getToday() {
  document.getElementById("task-due-date").setAttribute("min", today);
}

function setPrio(priority) {
  selectedPriority = priority;
}

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

function addSubtask() {
  let subtask = document.getElementById("task-subtask");
  subtasks.push(subtask.value);
  subtask.value = "";
  renderSubtasks();
}

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
