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
 * The function clears the contents of four columns in a task board.
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
 * The function loads a task list and renders drop areas for each status column.
 * @param ItemList - It is a parameter that represents an array of task items that need to be loaded
 * onto the task board.
 */
function loadTask(ItemList) {
  let toDoTasks = document.getElementById("col-todo");
  let progressTasks = document.getElementById("col-progress");
  let awaitingTasks = document.getElementById("col-awaiting");
  let doneTasks = document.getElementById("col-done");
  clearBoard();
  checkStatus(ItemList);
  toDoTasks.innerHTML += renderDropArea("dropzone-ToDo");
  progressTasks.innerHTML += renderDropArea("dropzone-progress");
  awaitingTasks.innerHTML += renderDropArea("dropzone-awaiting");
  doneTasks.innerHTML += renderDropArea("dropzone-done");
  inputType();
}

/**
 * The function checks the status of items in a list and renders them in their respective columns on a
 * webpage.
 * @param ItemList - an array of objects representing tasks/items to be displayed on a Kanban board.
 * Each object has a "state" property indicating which column of the board the task/item belongs to
 * (ToDo, progress, awaiting, or done). The function iterates through the array and renders each
 * task/item as a card
 */
function checkStatus(ItemList) {
  let toDoTasks = document.getElementById("col-todo");
  let progressTasks = document.getElementById("col-progress");
  let awaitingTasks = document.getElementById("col-awaiting");
  let doneTasks = document.getElementById("col-done");
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
}

/**
 * This function adds event listeners to a card element for touch and mouse input.
 * @param cardID - The ID of the card element that the function is selecting the input type for.
 */
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
 * Show the drop-zone for switching tasks
 */
function showDropZone() {
  let todo = document.getElementById("dropzone-ToDo");
  let progress = document.getElementById("dropzone-progress");
  let awaiting = document.getElementById("dropzone-awaiting");
  let done = document.getElementById("dropzone-done");

  if (todo.classList.contains("display-none")) {
    todo.classList.remove("display-none");
    progress.classList.remove("display-none");
    awaiting.classList.remove("display-none");
    done.classList.remove("display-none");
  }
}

/**
 * Hide the drop-zone for switching tasks
 */
function hideDropZone() {
  let todo = document.getElementById("dropzone-ToDo");
  let progress = document.getElementById("dropzone-progress");
  let awaiting = document.getElementById("dropzone-awaiting");
  let done = document.getElementById("dropzone-done");

  if (todo.classList.contains(!"display-none")) {
    todo.classList.add("display-none");
    progress.classList.add("display-none");
    awaiting.classList.add("display-none");
    done.classList.add("display-none");
  }
}

/**
 * Cancels the drag-event when its not feasable to drop at a dropzone
 * @param {EVENT} ev
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
  showDropZone();
}

/**
 * Set the new state of a task
 * @param {STRING} state State of the drop-zone
 */
function changeState(state) {
  tasks[currentDragElementID].state = state;
  hideDropZone();
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
 * The function shows an "Add Task" dialog box and sets the onClick event for the save task button.
 * @param state - The state parameter is a string that is passed as an argument to the saveTask
 * function when the "Save Task" button is clicked. It is used to determine whether the task being
 * added is a new task or an edited task.
 */
function showAddTask(state) {
  document.getElementById("addtask-card-headline").innerHTML = "Add Task";
  document
    .getElementById("save-task-button-desktop")
    .setAttribute("onClick", `saveTask(${'"' + state + '"'})`);
  document
    .getElementById("save-task-button-mobile")
    .setAttribute("onClick", `saveTask(${'"' + state + '"'})`);
  showElement("addtask-dialog");
  showElement("add-task-btn-clear");
  showElement("add-task-category-container");
  clearAll();
  $("body").addClass("no-scroll");
}

/**
 * This function deletes a task from an array of tasks and updates the IDs of the remaining tasks.
 * @param id - The id parameter is the index of the task to be deleted from the tasks array.
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
 * This function searches for tasks based on a given view and keyword, and loads the matching tasks
 * while removing any duplicates.
 * @param view - The ID of the HTML input element where the user enters their search query.
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
 * The function takes a list and returns a new list with only the unique values.
 * @param list - The parameter "list" is an array of values that may contain duplicates.
 * @returns The function `deleteDoubleValues` is returning a new array that contains only the unique
 * values from the input `list` array.
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
 * The function updates the properties of a task object and saves it to local storage.
 * @param id - The id parameter is the unique identifier of the task that needs to be updated. It is
 * used to access the specific task object in the tasks array and update its properties.
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
