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

/**
 * Set input-type for every card -> touch or mouse
 */
function inputType() {
  for (let i = 0; i < tasks.length; i++) {
    selectInputType(i);
  }
}

/**
 * delete all tasks from the board
 */
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

/**
 * Detect touch-input
 * @param {event} eventTouch
 * @param {INT} cardID ID of the card
 */
function touchScreen(eventTouch, cardID) {
  showTouchMenu(cardID);
  eventTouch.preventDefault();
}

/**
 * Detect mouse-input
 * @param {event} eventMouse
 * @param {INT} cardID ID of the card
 */
function mouseInput(eventMouse, cardID) {
  showTask(cardID);
  eventMouse.preventDefault();
}

/**
 * shows the mobile menu for cards
 * @param {INT} cardID ID of the card
 */
function showTouchMenu(cardID) {
  let cardMenu = document.getElementById("touch-menu" + cardID);
  cardMenu.classList.remove("display-none");
  renderTouchMenu(cardID);
  setTimeout(
    function (cardMenu) {
      hideElement("touch-menu" + cardID);
    },
    5000,
    cardMenu
  );
}

/**
 * Change the state of an task on touch-input
 * @param {INT} cardID ID of the card
 * @param {STRING} state destination state of the task
 */
function changeStateOnTouch(cardID, state) {
  currentDragElementID = cardID;
  changeState(state);
}

/**
 * switch subtask state between undone and done
 * @param {INT} taskId ID of the task
 * @param {INT} subtaskId ID of the subtask
 */
function toggleSubtaskStatus(taskId, subtaskId) {
  tasks[taskId].subtask[subtaskId].done ^= true;
  tcbChangedRenderSubtasks(tasks[taskId]);
}

/**
 * Hide the detail-view-card
 */
function closeTask() {
  let taskcard = document.getElementById("taskcard-big-container");
  taskcard.classList.add("display-none");
  $("body").removeClass("no-scroll");
  loadTask(tasks);
}

/**
 * Count the finished subtasks of one task
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
 * Convert Priority int to a readable string
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
 * @param {EVENT} ev
 * ! ICH HABE KEINE AHNUNG WARUM MAN DIE FUNKTION BENÖTIGT !
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Set the global variable with task.id
 * @param {INT} id ID of the draged task
 */
function drag(id) {
  currentDragElementID = id;
  tasks[id].state = "";
  toggleDropZone();
}

/**
 * Set the new state of a task
 * @param {STRING} state State of the drop-zone
 */
function changeState(state) {
  tasks[currentDragElementID].state = state;
  toggleDropZone();
  loadTask(tasks);
  backend.setItem("tasks", tasks);
}

/**
 * get initals of a user by user id
 * @param {INT} user id of assigned user
 * @returns STRING with initials
 */
function renderAssignedUserInitials(user) {
  const user1 = users.find((n) => n.id === user);
  return user1.initials;
}

/**
 * get name of a user by user id
 * @param {INT} user id of assigned user
 * @returns STRING with username
 */
function renderAssignedUserName(user) {
  const user1 = users.find((n) => n.id === user);
  return user1.name;
}

/**
 * Shows add-task-card with predefined state
 * @param {string} state
 */
function showAddTask(state) {
  document.getElementById("addtask-card-headline").innerHTML = "Add Task";
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
 * count the IDs new of all other tasks
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

/**
 * Push the tasks into subtasks-Array in add-task.js
 * @param {INT} id id of the current Task
 */
function fillSubtasks(id) {
  for (let i = 0; i < tasks[id].subtask.length; i++) {
    subtasks.push(tasks[id].subtask[i]);
  }
}

/**
 * Save updated datas to the backend
 * @param {INT} id id of the current Task
 */
function updateEditTask(id) {
  tasks[id].title = document.getElementById("task-title").value;
  tasks[id].description = document.getElementById("task-description").value;
  tasks[id].priority = selectedPriority;
  tasks[id].assignedTo = selectedUsers;
  tasks[id].dueDate = Date.parse(
    document.getElementById("task-due-date").value
  );
  tasks[id].subtask = subtasks;
  subtasks = [];
  backend.setItem("tasks", tasks);
  toggleVisibility("addtask-dialog");
  showTask(id);
}
