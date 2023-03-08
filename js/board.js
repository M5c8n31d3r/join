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
  return /* html */ `<div class="task-card" draggable="true" ondragstart="drag(${
    task.id
  })">
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
            <div class="progress-bar w-${
              (1 / task["subtask"].length) * 100
            }" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="${
    task["subtask"].length
  }"></div>
          </div>
          <span class="taskcard-subtasks-done">x/${
            task["subtask"].length
          } Done</span></div>
        <div class="taskcard-user-prio"> 
        <div class="center-row space-between">
            <div id="assignedToUser"></div>
            <img src="/assets/img/icons/icon-prio-${prioIconEnding(
              task
            )}.svg" alt="${prioIconEnding(task)} prio" />
            </div>
        </div>
    </div>`;
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
function renderUser(task) {
  let userList = document.getElementById("assignedToUser");
  userList.innerHTML = "";
  for (let i = 0; i < task.assignedTo.length; i++) {
    const user = task.assignedTo[i];
    userList.innerHTML += `<div>${renderSelectedUserDetails(user)}</div>`;
  }
}

/**
 *
 * @param {INT} user ??????????
 * @returns
 * ToDo: Klärung wofür die Funktion ist
 */
function renderSelectedUserDetails(user) {
  const user1 = users.find((n) => n.id === user);
  return user1.initials;
}
