async function initSummary() {
  await includeHTML();
  await loadDataFromServer();
  loadAllCounters();
  // activeSummaryNavLink();
  setWelcomeMsg();
  await setCurrentUser();
}

async function setCurrentUser() {
  userLogIn = localStorage.getItem("userLogIn", userLogIn);
  if (userLogIn == null || userLogIn == 0) {
    // document.getElementById("welcome-name-mobile").innerHTML = "";
    document.getElementById("welcome-name-desk").innerHTML = "";
  } else {
    // document.getElementById("welcome-name-mobile").innerHTML =
    users[userLogIn].name;
    document.getElementById("welcome-name-desk").innerHTML =
      users[userLogIn].name;
  }
}

function setWelcomeMsg() {
  const currDate = new Date();
  const currHour = currDate.getHours();
  const welcomeTextDesk = document.getElementById("welcome-text-desk");
  const welcomeTextMobile = document.getElementById("welcome-text-mobile");
  let welcomeText = "";

  switch (true) {
    case currHour < 12:
      welcomeText = "Good morning,";
      break;
    case currHour >= 12 && currHour < 17:
      welcomeText = "Good afternoon,";
      break;
    case currHour >= 17:
      welcomeText = "Good evening,";
      break;
  }

  welcomeTextDesk.innerHTML = welcomeText;
  // welcomeTextMobile.innerHTML = welcomeText;
}

function loadAllCounters() {
  let allTasks = document.getElementById("board-counter");
  let progress = document.getElementById("progress-counter");
  let review = document.getElementById("feedback-counter");
  let todo = document.getElementById("todo-counter");
  let done = document.getElementById("done-counter");
  let dueDate = document.getElementById("deadline-date");
  let urgent = document.getElementById("urgent-counter");
  let counterProgress = 0;
  let counterReview = 0;
  let counterTodo = 0;
  let counterDone = 0;
  let counterUrgent = 0;
  let tempDate = Number.MAX_SAFE_INTEGER; // Größte mögliche Zahl

  allTasks.innerHTML = tasks.length;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].state == "progress") {
      counterProgress++;
    }
    if (tasks[i].state == "awaiting") {
      counterReview++;
    }
    if (tasks[i].state == "ToDo") {
      counterTodo++;
    }
    if (tasks[i].state == "done") {
      counterDone++;
    }
    if (tasks[i].priority == -1) {
      counterUrgent++;
    }
    if (tasks[i].dueDate < tempDate) {
      tempDate = tasks[i].dueDate;
    }
  }
  progress.innerHTML = counterProgress;
  review.innerHTML = counterReview;
  todo.innerHTML = counterTodo;
  done.innerHTML = counterDone;
  urgent.innerHTML = counterUrgent;
  tempDate = new Date(tempDate);
  dueDate.innerHTML = tempDate.toDateString(); //Fehler in der Convertierung
}

function goToBoard() {
  window.location.assign("./board.html");
}
