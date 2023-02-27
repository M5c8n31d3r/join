const counter = [
  { type: "progress", name: "counterProgress", value: 0 },
  { type: "awaiting", name: "counterReview", value: 0 },
  { type: "ToDo", name: "counterTodo", value: 0 },
  { type: "done", name: "counterDone", value: 0 },
  { type: -1, name: "counterUrgent", value: 0 }
];

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
  for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < counter.length; j++) {
      counter[j].value += counterLoop(i, counter[j].type);
    }
  }
  renderCounter();
}

function renderCounter() {
  document.getElementById("board-counter").innerHTML = tasks.length;
  document.getElementById("progress-counter").innerHTML = counter[0].value;
  document.getElementById("feedback-counter").innerHTML = counter[1].value;
  document.getElementById("todo-counter").innerHTML = counter[2].value;
  document.getElementById("done-counter").innerHTML = counter[3].value;
  document.getElementById("urgent-counter").innerHTML = counter[4].value;
}

function counterLoop(id, name) {
  if (tasks[id].state == name || tasks[id].priority == name) {
    return 1;
  } else {
    return 0;
  }
}

function goToBoard() {
  window.location.assign("./board.html");
}

/*
! Das war der erste entwurf zur Zeit, muss noch überarbeitet werden !
document.getElementById("deadline-date"),
if (tasks[i].dueDate < tempDate) {
tempDate = tasks[i].dueDate;
}
tempDate = new Date(tempDate);
dueDate.innerHTML = tempDate.toDateString(); //Fehler in der Convertierung
    */
