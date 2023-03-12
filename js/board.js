// Global variables
let currentDragElementID = -1;

/**
 * Initialisation after loading the page
 */
async function initBoard() {
  await includeHTML();
  await loadDataFromServer();
  setActive("nav-board");
  loadTask();
}

/**
 * Load HTML-Elements
 * ToDo: Länge der Funktion prüfen
 */
function loadTask() {
  let toDoTasks = document.getElementById("col-todo");
  let progressTasks = document.getElementById("col-progress");
  let awaitingTasks = document.getElementById("col-awaiting");
  let doneTasks = document.getElementById("col-done");
  toDoTasks.innerHTML = "";
  progressTasks.innerHTML = "";
  awaitingTasks.innerHTML = "";
  doneTasks.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (tasks[i].state == "ToDo") {
      toDoTasks.innerHTML += renderCard(task);
    } else if (tasks[i].state == "progress") {
      progressTasks.innerHTML += renderCard(task);
    } else if (tasks[i].state == "awaiting") {
      awaitingTasks.innerHTML += renderCard(task);
    } else if (tasks[i].state == "done") {
      doneTasks.innerHTML += renderCard(task);
    }
  }
  toDoTasks.innerHTML += renderDropArea("dropzone-ToDo");
  progressTasks.innerHTML += renderDropArea("dropzone-progress");
  awaitingTasks.innerHTML += renderDropArea("dropzone-awaiting");
  doneTasks.innerHTML += renderDropArea("dropzone-done");
}

/**
 *
 * @param {STRING} id HTML-ID of Drop-Area
 * @returns HTML-Box for Drop-Area
 */
function renderDropArea(id) {
  return /* html */ `<div id="${id}" class="box display-none"></div>`;
}

/**
 *
 * @param {OBJECT} task One Task of Tasks-Array
 * @returns HTML-Card with Task-Information
 *
 * ToDo Länge der Funktion prüfen
 */
function renderCard(task) {
  return /* html */ `<div class="task-card" onclick="showTask(${
    task.id
  })" draggable="true" ondragstart="drag(${task.id})">
        <div style="background-color: ${
          task.category.color
        }" class="taskcard-category flex center"><div class="taskcard-category-name">${
    task.category.name
  }</div></div>
        <h3 class="taskcard-title font-16 bold">${task["title"]}</h3>
        <p class="taskcard-description">${task["description"]}
        </p>
        <div class="taskcard-subtasks flex center gap-s space-between"> 
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${
              (countDoneSubtasks(task.subtask) / task.subtask.length) * 100
            }%"></div>
          </div>
          <span class="taskcard-subtasks-done">${countDoneSubtasks(
            task.subtask
          )}/${task.subtask.length} Done</span></div>
        <div class="taskcard-user-prio"> 
        <div class="center-row space-between">
            <div class="flex gap-s">${renderUserInitials(task)}</div>
            <img src="../assets/img/icons/icon-prio-${prioIconEnding(
              task
            )}.svg" alt="${prioIconEnding(task)} prio" />
            </div>
        </div>
    </div>`;
}

function showTask(id) {
  let taskcard = document.getElementById("taskcard-big");
  let task = tasks[id];
  taskcard.innerHTML = "";
  taskcard.classList.remove("display-none");
  $("body").addClass("no-scroll");
  taskcard.innerHTML += /* html */ `
  <div class="tcb-first-line flex space-between">
    <div style="background-color: ${
      task.category.color
    }" class="taskcard-category flex center">
      <div class="taskcard-category-name">${task.category.name}</div>
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
    <span class="tcp-subline">Priority:</span>
    <div class="tcb-prio" style="">
      <span>${task.priority}</span>
      <img src="../assets/img/icons/icon-prio-${prioIconEnding(task)}.svg"/>
    </div>
  </div>
  <div class="tcb-line">
    <span class="tcp-subline">Assigned to:</span>
    ${renderUser(task)}
  </div>
`;
}

function closeTask() {
  let taskcard = document.getElementById("taskcard-big");
  taskcard.classList.add("display-none");
  $("body").removeClass("no-scroll");
}

/**
 *
 * @param {OBJECT} subtasks Array of subtasks
 * @returns {INT} Counter of subtasks, which are ready
 */
function countDoneSubtasks(subtasks) {
  let countDone = 0;
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    subtask.done ? countDone++ : 0;
  }
  return countDone;
}
/**
 *
 * @param {OBJECT} task one task of Tasks-Array
 * @returns String for priority
 */
function prioIconEnding(task) {
  if (task.priority == 1) {
    return "low";
  }
  if (task.priority == 0) {
    return "medium";
  }
  if (task.priority == -1) {
    return "urgent";
  }
}

/**
 * Show and hide the drop-zone for switching tasks
 */
function toggleDropZone() {
  let todo = document.getElementById("dropzone-ToDo");
  let progress = document.getElementById("dropzone-progress");
  let awaiting = document.getElementById("dropzone-awaiting");
  let done = document.getElementById("dropzone-done");

  if (todo.classList.contains("display-none")) {
    todo.classList.remove("display-none");
    progress.classList.remove("display-none");
    awaiting.classList.remove("display-none");
    done.classList.remove("display-none");
  } else {
    todo.classList.add("display-none");
    progress.classList.add("display-none");
    awaiting.classList.add("display-none");
    done.classList.add("display-none");
  }
}

/**
 *
 * @param {} ev
 * ! ICH HABE KEINE AHNUNG WARUM MAN DIE FUNKTION BENÖTIGT !
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 *
 * @param {INT} id ID of the draged task
 * Set the global variable with task.id
 */
function drag(id) {
  currentDragElementID = id;
  tasks[id].state = "";
  toggleDropZone();
}

/**
 *
 * @param {STRING} state State of the drop-zone
 * Set the new state of a task
 */
function changeState(state) {
  tasks[currentDragElementID].state = state;
  toggleDropZone();
  loadTask();
  backend.setItem("tasks", tasks);
}

/**
 *
 * @param {OBJECT} task one task of tasks-array
 * ! noch nicht eingebunden -> DS
 * ToDo wird noch bearbeitet -> Beschreibung muss noch angepasst werden
 */
function renderUserInitials(task) {
  let userList = "";
  for (let i = 0; i < task.assignedTo.length; i++) {
    const user = task.assignedTo[i];
    userList += `<div class="initials-board font-12 center">${renderAssignedUserInitials(
      user
    )}</div>`;
  }
  return userList;
}

function renderUser(task) {
  let userList = "";
  for (let i = 0; i < task.assignedTo.length; i++) {
    const user = task.assignedTo[i];
    userList += /*html*/ `
    <div class="tcb-user-line flex center-row gap">
      <div class="initials font-16 center">${renderAssignedUserInitials(
        user
      )}</div>
      <div>${renderAssignedUserName(user)}</div>
    </div>
    `;
  }
  return userList;
}

/**
 *
 * @param {INT} user ??????????
 * @returns
 * ToDo: Klärung wofür die Funktion ist
 */
function renderAssignedUserInitials(user) {
  const user1 = users.find((n) => n.id === user);
  return user1.initials;
}

function renderAssignedUserName(user) {
  const user1 = users.find((n) => n.id === user);
  return user1.name;
}
