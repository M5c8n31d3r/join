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
  setActive("nav-summary");
  loadAllCounters();
  setWelcomeMsg();
  setCurrentUser();
  setDeadline();
}

function setCurrentUser() {
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
      welcomeText = "Good morning";
      break;
    case currHour >= 12 && currHour < 17:
      welcomeText = "Good afternoon";
      break;
    case currHour >= 17:
      welcomeText = "Good evening";
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

function setDeadline() {
  let dateField = document.getElementById("deadline-date");
  let minDate = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].dueDate != "") {
      if (tasks[i].dueDate < minDate) {
        minDate = tasks[i].dueDate;
      }
    }
  }
  dateField.innerHTML = timeConverter(minDate);
}

function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp);
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  return month + " " + date + ", " + year;
}
