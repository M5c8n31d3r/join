let currentDragElementID = -1;

async function initBoard() {
  await includeHTML();
  await loadDataFromServer();
  loadTask();
  // activeSummaryNavLink();
}

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
    if (tasks[i]["state"] == "ToDo") {
      toDoTasks.innerHTML += renderCard(task);
    } else if (tasks[i]["state"] == "progress") {
      progressTasks.innerHTML += renderCard(task);
    } else if (tasks[i]["state"] == "awaiting") {
      awaitingTasks.innerHTML += renderCard(task);
    } else if (tasks[i]["state"] == "done") {
      doneTasks.innerHTML += renderCard(task);
    }
  }
}

function renderCard(task) {
  return /* html */ `<div class="task-card" draggable="true" ondragstart="drag(${
    task.id
  })">
        <h3>${task["title"]}</h3>
        <p>${task["description"]}
        </p>
        <span>progress bar</span>
        <div class="center-row space-between">
            <div>${task["assignedTo"]}</div>
            <img src="/assets/img/icons/icon-prio-${prioIconEnding(
              task
            )}.svg" alt="${prioIconEnding(task)} prio" />
            </div>
    </div>`;
}

function prioIconEnding(task) {
  if (task["priority"] == 1) {
    return "low";
  }
  if (task["priority"] == 0) {
    return "medium";
  }
  if (task["priority"] == -1) {
    return "urgent";
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(id) {
  currentDragElementID = id;
}

function changeState(state) {
  tasks[currentDragElementID].state = state;
  loadTask();
  backend.setItem("tasks", tasks);
  console.log(tasks);
}
