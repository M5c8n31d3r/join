/**
 * Generate box for visual feedback of the drop-area
 * @param {STRING} id HTML-ID of Drop-Area
 * @returns HTML-Box for Drop-Area
 */
function renderDropArea(id) {
  return /* html */ `<div id="${id}" class="drop-box display-none"></div>`;
}

/**
 * Generate HTML for card
 * @param {OBJECT} task One Task of Tasks-Array
 * @returns HTML-Card with Task-Information
 */
function renderCard(task) {
  let cardID = "card" + task.id;
  return /* html */ `
  <div id="${cardID}" class="task-card pointer" onclick="selectInputType(${
    task.id
  })" draggable="true" ondragstart="drag(${
    task.id
  })" ondragend="hideDropZone()">
        <div style="background-color: ${
          task.category.color
        }" class="taskcard-category flex center">
          <div class="taskcard-category-name">${task.category.name}</div>
        </div>
        <h3 class="taskcard-title font-16 bold">${task["title"]}</h3>
        <p class="taskcard-description">${task["description"]}
        </p>
        ${renderCardProgressbar(task)}
        <div class="taskcard-user-prio"> 
        <div class="flex center-row space-between">
            <div class="flex gap-s">${renderUserInitials(task)}</div>
            <img src="../assets/img/icons/icon-prio-${prioIconEnding(
              task
            )}.svg" alt="${prioIconEnding(task)} prio" />
            </div>
        </div>
        
    </div>
    <div id="touch-menu${
      task.id
    }" class="card-touch-menu display-none">Here I am!!!</div>`;
}

function renderCardProgressbar(task) {
  if (task.subtask.length) {
    return /* html */ `
  <div class="taskcard-subtasks flex center gap-s space-between"> 
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${
              (countDoneSubtasks(task.subtask) / task.subtask.length) * 100
            }%"></div>
          </div>
          <span class="taskcard-subtasks-done">${countDoneSubtasks(
            task.subtask
          )}/${task.subtask.length} Done</span></div>`;
  } else {
    return "";
  }
}

/**
 * Generate Menu for switching status on touch
 * @param {INT} cardID ID of the card for the menu
 */
function renderTouchMenu(cardID) {
  let cardMenu = document.getElementById("touch-menu" + cardID);
  let states = ["ToDo", "progress", "awaiting", "done"];
  cardMenu.innerHTML = /* html */ `<div class="ctm-small">⬇ open ⬇</div><div onClick="showTask(${cardID})">Details</div> <hr> <div class="ctm-small">⬇ move to ⬇</div>`;
  for (let i = 0; i < states.length; i++) {
    if (tasks[cardID].state == states[i]) {
      states.splice(i, 1);
    }
  }
  for (let i = 0; i < states.length; i++) {
    cardMenu.innerHTML += /*html */ ` 
      <div onclick="changeStateOnTouch(${cardID}, '${states[i]}')" class="ctm-item">${states[i]}</div>`;
  }
}

/**
 * render detail view of one task
 * @param {INT} id ID of the task
 */
function showTask(id) {
  let taskcard = document.getElementById("taskcard-big");
  let task = tasks[id];
  taskcard.innerHTML = "";
  document
    .getElementById("taskcard-big-container")
    .classList.remove("display-none");
  $("body").addClass("no-scroll");
  taskcard.innerHTML += /* html */ `
  <div class="tcb-first-line flex space-between">
    <div style="background-color: ${
      task.category.color
    }" class="taskcard-category flex center">
      <div class="taskcard-category-name font-21">${task.category.name}</div>
    </div>
    <a class="back-arrow left top" onclick="closeTask()"><img src="../assets/img/icons/icon-arrow-back.svg" alt="Go back"/>
    </a>
  </div>
   <p class="tcb-headline">${task["title"]}</p>
  <div class="tcb-description">${task["description"]}</div>
  <div class="tcb-line">
    <span class="tcp-subline">Due Date:</span><span class="tcp-due-date">${timeConverter(
      task["dueDate"]
    )}</span>
  </div>
  <div class="tcb-line flex">
    <span class="tcp-subline flex center-row">Priority:</span>
    <div class="tcb-prio flex center-row gap-m" style="background-color: ${
      prios.find((item) => item.id === task.priority).color
    }">
      <span class="tcp-prio-name">${
        prios.find((item) => item.id === task.priority).name
      }</span>
      <img class="tcp-prio-icon" src="../assets/img/icons/icon-prio-${prioIconEnding(
        task
      )}.svg"/>
    </div>
  </div>
  <div class="tcb-line">
    <span class="tcp-subline">Subtasks:</span>
    <div id="tcb-subtasks">${tcbRenderSubtasks(task)}</div>
  </div>
  <div class="tcb-line">
    <span class="tcp-subline">Assigned to:</span>
    ${renderUser(task)}
  </div>
  <button class="tcb-btn-delete-task flex center" onclick="deleteTask(${
    task.id
  })"><img class="icon-white" style= "cursor: pointer" src="../assets/img/icons/icon-delete.svg"></button>
  <button class="tcb-btn-edit-task flex center" onclick="loadEditTask(${id})"><img style= "cursor: pointer" class="icon-white" src="../assets/img/icons/icon-to-do.svg"></button>
`;
}

/**
 * tcb = TaskCardBig
 * Generate the subtasks in detail-view of the task
 * @param {OBJECT} task
 * @returns {ARRAY} Subtasks as HTML-Object
 */
function tcbRenderSubtasks(task) {
  let subtasks = "";
  for (let i = 0; i < task.subtask.length; i++) {
    const subtask = task.subtask[i];
    subtasks += /*html*/ `
    <div id="subtask-${task.id}-${i}" class="flex gap center-row task-done-${
      subtask.done
    }">
      <div class="flex">
        <input type="checkbox" ${subtask.done ? "checked" : ""} id="subtask-${
      task.id
    }-${i}-input" onclick="toggleSubtaskStatus(${task.id}, ${i})">
      </div>
      <label class="margin0 flex" for="subtask-${task.id}-${i}-input"> ${
      subtask.description
    }</label>
    </div>`;
  }
  return subtasks;
}

/**
 * tcb = TaskCardBig
 * renders the changed subtasks when done in the task display
 * @param {OBJECT} task
 */
function tcbChangedRenderSubtasks(task) {
  let tcbSubtasks = document.getElementById("tcb-subtasks");
  tcbSubtasks.innerHTML = "";
  let subtasks = "";
  for (let i = 0; i < task.subtask.length; i++) {
    const subtask = task.subtask[i];
    subtasks += /*html*/ `
    <div id="subtask-${task.id}-${i}" class="flex gap center-row task-done-${
      subtask.done
    }">
      <div class="flex">
        <input type="checkbox" ${subtask.done ? "checked" : ""} id="subtask-${
      task.id
    }-${i}-input" onclick="toggleSubtaskStatus(${task.id}, ${i})">
      </div>
      <label class="margin0 flex" for="subtask-${task.id}-${i}-input"> ${
      subtask.description
    }</label>
    </div>`;
  }
  tcbSubtasks.innerHTML = subtasks;
}

/**
 * Generate small icon with initials of assigned users
 * @param {OBJECT} task one task of tasks-array
 */
function renderUserInitials(task) {
  let userList = "";
  for (let i = 0; i < task.assignedTo.length; i++) {
    const user = task.assignedTo[i];
    let bg = i % 4;
    userList += `<div class="initials-board initials-bg${bg} font-12 center">${renderAssignedUserInitials(
      user
    )}</div>`;
  }
  return userList;
}

/**
 * Generat the assigned user for a single task
 * @param {OBJECT} task
 * @returns HTML-Element
 */
function renderUser(task) {
  let userList = "";
  for (let i = 0; i < task.assignedTo.length; i++) {
    const user = task.assignedTo[i];
    let bg = i % 4;
    userList += /*html*/ `
    <div class="tcb-user-line flex center-row gap">
      <div class="initials initials-bg${bg} font-16 center">${renderAssignedUserInitials(
      user
    )}</div>
      <div>${renderAssignedUserName(user)}</div>
    </div>
    `;
  }
  return userList;
}

/**
 * Fill the input fields with values of the task
 * @param {INT} id ID of the Task
 */
function loadEditTask(id) {
  document.getElementById("task-title").value = tasks[id].title;
  document.getElementById("task-description").value = tasks[id].description;
  document.getElementById("category-input").value = tasks[id].category.name;
  document.getElementById("assigned-to-user").value = tasks[id].assignedTo;
  document.getElementById("task-due-date").valueAsNumber = tasks[id].dueDate;
  let subtasks = document.getElementById("task-subtasks");
  let btnDesktop = document.getElementById("save-task-button-desktop");
  let btnMobile = document.getElementById("save-task-button-mobile");
  selectedUsers = tasks[id].assignedTo;
  document.getElementById("addtask-card-headline").innerHTML = "Edit Task";
  checkPriority(id);
  fillSubtasks(id);

  toggleVisibility("addtask-dialog");
  document.getElementById("add-task-btn-clear").classList.add("display-none");
  document
    .getElementById("add-task-category-container")
    .classList.add("display-none");

  btnDesktop.setAttribute("onclick", `updateEditTask(${id})`);
  btnDesktop.innerHTML = "Save";
  btnMobile.setAttribute("onclick", `updateEditTask(${id})`);
  btnMobile.innerHTML = "Save";

  subtasks.innerHTML = tcbRenderSubtasks(tasks[id]);
  // assignedTo.innerHTML = renderUser(tasks[id]);
}

/**
 * Set the priority in HTML
 * @param {INT} id id of the current Task
 */
function checkPriority(id) {
  selectedPriority = tasks[id].priority;
  if (tasks[id].priority == -1) {
    document.getElementById("task-urgent").checked = true;
  } else if (tasks[id].priority == 0) {
    document.getElementById("task-medium").checked = true;
  } else {
    document.getElementById("task-low").checked = true;
  }
}
