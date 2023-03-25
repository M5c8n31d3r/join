/**
 * Generate the drop-down-list of categories
 */
function loadCategories() {
  let listItems = document.getElementById("category-list");
  listItems.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    listItems.innerHTML += `
      <div id='category-${categories[i].id}' onclick='selectCategory(${categories[i].id})' class="dropdown-item flex center-row">
        <span class="category-name">${categories[i].name}</span>
        <div class="category-color" style="background-color: ${categories[i].color}"></div>
      </div>`;
  }
}

/**
 * Fill the drop-down-list for categories
 * @param {INT} id ID of the category
 * @returns HTML-Code for the category in drop-down-menu
 */
function fillCatergory(id) {
  selectedCategory = {
    id: id,
    name: categories[id].name,
    color: categories[id].color
  };
  return `
<div class="flex center-row">
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
 * Render the small circle with the initials of the selected useres
 */
function renderSelectedUsers() {
  let selectedUserList = document.getElementById("assigned-to-user");
  selectedUserList.innerHTML = "";
  for (let i = 0; i < selectedUsers.length; i++) {
    selectedUserList.innerHTML += `<div class="initials initials-bg${
      i % 4
    } center">${renderSelectedUserDetails(selectedUsers[i])}</div>`;
  }
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
      <label class="subtask-label" for="subtask-${i}"> ${subtask.description}</label>
    </div>`;
  }
}
