async function initSummary() {
  await includeHTML();
  await loadTasks();
  loadAllCounters();
  // activeSummaryNavLink();
}

async function loadTasks() {
  let download = await downloadFromServer();
  download = await JSON.parse(download);
  tasks.splice(0, tasks.length);
  for (let i = 0; i < download.tasks.length; i++) {
    tasks.push(download.tasks[i]);
  }
  console.log("fertig");
}

function loadAllCounters() {
  let allTasks = document.getElementById("board-counter");
  let progress = document.getElementById("progress-counter");
  let review = document.getElementById("feedback-counter");
  let todo = document.getElementById("todo-counter");
  let done = document.getElementById("done-counter");
  let dueDate = document.getElementById("deadline-date");
  let counterProgress = 0;
  let counterReview = 0;
  let counterTodo = 0;
  let counterDone = 0;
  let tempDate = Number.MAX_SAFE_INTEGER; // Größte mögliche Zahl

  allTasks.innerHTML = tasks.length;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].state == "progress") {
      counterProgress++;
    }
    if (tasks[i].state == "review") {
      counterReview++;
    }
    if (tasks[i].state == "ToDo") {
      counterTodo++;
    }
    if (tasks[i].state == "done") {
      counterDone++;
    }
    if (tasks[i].dueDate < tempDate) {
      tempDate = tasks[i].dueDate;
    }
  }
  progress.innerHTML = counterProgress;
  review.innerHTML = counterReview;
  todo.innerHTML = counterTodo;
  done.innerHTML = counterDone;
  tempDate = new Date(tempDate);
  dueDate.innerHTML = tempDate.toDateString(); //Fehler in der Convertierung
}

function goToBoard() {
  window.location.assign("./board.html");
}
