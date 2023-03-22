// Global variables
let currentDragElementID = -1;

let prios = [
  { id: -1, name: "Urgent", color: "var(--urgent)" },
  { id: 0, name: "Medium", color: "var(--medium)" },
  { id: 1, name: "Low", color: "var(--low)" }
];

/**
 * Initialisation after loading the page
 */
async function initBoard() {
  await includeHTML();
  await loadDataFromServer();
  loadCategories();
  loadUserList();
  getToday();
  setActive("nav-board");
  loadTask(tasks);
}

function inputType() {
  for (let i = 0; i < tasks.length; i++) {
    selectInputType(i);
  }
}

function clearBoard() {
  let toDoTasks = document.getElementById("col-todo");
  let progressTasks = document.getElementById("col-progress");
  let awaitingTasks = document.getElementById("col-awaiting");
  let doneTasks = document.getElementById("col-done");
  toDoTasks.innerHTML = "";
  progressTasks.innerHTML = "";
  awaitingTasks.innerHTML = "";
  doneTasks.innerHTML = "";
}

/**
 * Load HTML-Elements
 * ToDo: Länge der Funktion prüfen
 */
function loadTask(ItemList) {
  let toDoTasks = document.getElementById("col-todo");
  let progressTasks = document.getElementById("col-progress");
  let awaitingTasks = document.getElementById("col-awaiting");
  let doneTasks = document.getElementById("col-done");
  clearBoard();

  for (let i = 0; i < ItemList.length; i++) {
    if (ItemList[i].state == "ToDo") {
      toDoTasks.innerHTML += renderCard(ItemList[i]);
    } else if (ItemList[i].state == "progress") {
      progressTasks.innerHTML += renderCard(ItemList[i]);
    } else if (ItemList[i].state == "awaiting") {
      awaitingTasks.innerHTML += renderCard(ItemList[i]);
    } else if (ItemList[i].state == "done") {
      doneTasks.innerHTML += renderCard(ItemList[i]);
    }
  }
  toDoTasks.innerHTML += renderDropArea("dropzone-ToDo");
  progressTasks.innerHTML += renderDropArea("dropzone-progress");
  awaitingTasks.innerHTML += renderDropArea("dropzone-awaiting");
  doneTasks.innerHTML += renderDropArea("dropzone-done");
  inputType();
}

/**
 *
 * @param {STRING} id HTML-ID of Drop-Area
 * @returns HTML-Box for Drop-Area
 */
function renderDropArea(id) {
  return /* html */ `<div id="${id}" class="drop-box display-none"></div>`;
}

/**
 *
 * @param {OBJECT} task One Task of Tasks-Array
 * @returns HTML-Card with Task-Information
 *
 * ToDo Länge der Funktion prüfen
 */
function renderCard(task) {
  let cardID = "card" + task.id;
  return /* html */ `
  <div id="${cardID}" class="task-card pointer" onclick="selectInputType(${
    task.id
  })" draggable="true" ondragstart="drag(${task.id})">
        <div style="background-color: ${
          task.category.color
        }" class="taskcard-category flex center">
          <div class="taskcard-category-name">${task.category.name}</div>
        </div>
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
        <div class="flex center-row space-between">
            <div class="flex gap-s">${renderUserInitials(task)}</div>
            <img src="../assets/img/icons/icon-prio-${prioIconEnding(
              task
            )}.svg" alt="${prioIconEnding(task)} prio" />
            </div>
        </div>
        
    </div>
    <div id="touch-menu${task.id}" class="display-none">Here I am!!!</div>`;
}

function selectInputType(cardID) {
  let htmlID = "card" + cardID;
  let card = document.getElementById(htmlID);

  card.addEventListener(
    "touchstart",
    function (event) {
      touchScreen(event, cardID);
    },
    false
  );
  card.addEventListener(
    "click",
    function (event) {
      mouseInput(event, cardID);
    },
    false
  );
}

function touchScreen(eventTouch, cardID) {
  showTouchMenu(cardID);
  eventTouch.preventDefault();
}

function mouseInput(eventMouse, cardID) {
  showTask(cardID);
  eventMouse.preventDefault();
}

function showTouchMenu(cardID) {
  let cardMenu = document.getElementById("touch-menu" + cardID);
  cardMenu.classList.remove("display-none");
  renderTouchMenu(cardID);
  setTimeout(
    function (cardMenu) {
      cardMenu.classList.add("display-none");
    },
    10000,
    cardMenu
  );
}

function renderTouchMenu(cardID) {
  let cardMenu = document.getElementById("touch-menu" + cardID);
  let states = ["ToDo", "progress", "awaiting", "done"];
  cardMenu.innerHTML = "";
  for (let i = 0; i < states.length; i++) {
    if (tasks[cardID].state == states[i]) {
      states.splice(i, 1);
    }
  }
  for (let i = 0; i < states.length; i++) {
    cardMenu.innerHTML += /*html */ ` 
      <div onclick="changeStateOnTouch(${cardID}, '${states[i]}')">${states[i]}</div>`;
  }
}

function changeStateOnTouch(cardID, state) {
  currentDragElementID = cardID;
  changeState(state);
}

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
  })"><img class="icon-white" src="../assets/img/icons/icon-delete.svg"></button>
  <button class="tcb-btn-edit-task flex center" onclick="loadEditTask(${id})"><img class="icon-white" src="../assets/img/icons/icon-to-do.svg"></button>
`;
}

/**
 * tcb = TaskCardBig
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
 *
 * @param {*} task
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

function toggleSubtaskStatus(taskId, subtaskId) {
  tasks[taskId].subtask[subtaskId].done ^= true;
  tcbChangedRenderSubtasks(tasks[taskId]);
}

function closeTask() {
  let taskcard = document.getElementById("taskcard-big-container");
  taskcard.classList.add("display-none");
  $("body").removeClass("no-scroll");
  loadTask(tasks);
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
 * TODO Irgendetwas für Drag and Drop -> DOKU BEI W3-SCHOOLS NOCH LESEN
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
  loadTask(tasks);
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
    let bg = i % 4;
    userList += `<div class="initials-board initials-bg${bg} font-12 center">${renderAssignedUserInitials(
      user
    )}</div>`;
  }
  return userList;
}

/**
 * ToDO Beschreibung fehlt noch
 * @param {*} task
 * @returns
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
 *
 * @param {INT} user ??????????
 * @returns
 * ToDo: Klärung wofür die Funktion ist
 */
function renderAssignedUserInitials(user) {
  const user1 = users.find((n) => n.id === user);
  return user1.initials;
}

/**
 * ToDO Beschreibung fehlt noch
 * @param {*} user
 * @returns
 */
function renderAssignedUserName(user) {
  const user1 = users.find((n) => n.id === user);
  return user1.name;
}

/**
 * ToDO Beschreibung fehlt noch
 */
function showAddTask(state) {
  document
    .getElementById("save-task-button-desktop")
    .setAttribute("onClick", `saveTask(${'"' + state + '"'})`);
  document
    .getElementById("save-task-button-mobile")
    .setAttribute("onClick", `saveTask(${'"' + state + '"'})`);
  document.getElementById("addtask-dialog").classList.remove("display-none");
  document
    .getElementById("add-task-btn-clear")
    .classList.remove("display-none");
  document
    .getElementById("add-task-category-container")
    .classList.remove("display-none");
  clearAll();
  $("body").addClass("no-scroll");
}

/**
 * Delete one Item of TASKS-Array
 *
 * @param {INT} id Item to delete
 */
function deleteTask(id) {
  tasks.splice(id, 1);
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].id = i;
  }
  backend.setItem("tasks", tasks);
  closeTask();
}

/**
 * Filter list of view on search result
 * @param {STRING} view ID of search input
 */
function findTask(view) {
  let search = document.getElementById(view).value;
  const items = new Array();

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].title.toLowerCase().includes(search.toLowerCase())) {
      items.push(tasks[i]);
    }
    if (tasks[i].description.toLowerCase().includes(search.toLowerCase())) {
      items.push(tasks[i]);
    }
  }

  loadTask(deleteDoubleValues(items));
}

/**
 * Deletes double entries
 * @param {ARRAY} list List of filtered Items
 * @returns
 */
function deleteDoubleValues(list) {
  let unique = list.filter((x, i) => list.indexOf(x) === i);
  return unique;
}

function loadEditTask(id) {
  let title = document.getElementById("task-title");
  let description = document.getElementById("task-description");
  let category = document.getElementById("category-input");
  let assignedTo = document.getElementById("assigned-to-user");
  let dueDate = document.getElementById("task-due-date");
  let subtasks = document.getElementById("task-subtasks");
  let btnDesktop = document.getElementById("save-task-button-desktop");
  let btnMobile = document.getElementById("save-task-button-mobile");

  toggleVisibility("addtask-dialog");
  document.getElementById("add-task-btn-clear").classList.add("display-none");
  document
    .getElementById("add-task-category-container")
    .classList.add("display-none");

  btnDesktop.setAttribute("onclick", `updateEditTask(${id})`);
  btnDesktop.innerHTML = "Save";
  btnMobile.setAttribute("onclick", `updateEditTask(${id})`);
  btnMobile.innerHTML = "Save";

  title.value = tasks[id].title;
  description.value = tasks[id].description;
  category.value = tasks[id].category.name;
  assignedTo.value = tasks[id].assignedTo;
  dueDate.valueAsNumber = tasks[id].dueDate;
  subtasks.innerHTML = tcbRenderSubtasks(tasks[id]);
  assignedTo.innerHTML = renderUser(tasks[id]);
}

//  !ES FEHLT NOCH DIE PRIORITY
function updateEditTask(id) {
  let taskChanged = tasks[id];
  let titleInput = document.getElementById("task-title").value;
  let descriptionInput = document.getElementById("task-description").value;
  let assignedToInput = document.getElementById("assigned-to-user").value;
  let subtasksInput = document.getElementById("task-subtasks");
  taskChanged.title = titleInput;
  taskChanged.description = descriptionInput;
  taskChanged.assignedTo = assignedToInput;
  taskChanged.dueDate = Date.parse(
    document.getElementById("task-due-date").value
  );
  backend.setItem("tasks", tasks);
  toggleVisibility("addtask-dialog");
  showTask(id);
}
