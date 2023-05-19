const mobileMaxWidth = 780;
const welcomeMsgDelay = 800;
const welcomeMsgTrans = 400;
const counter = [
  { type: "progress", name: "counterProgress", value: 0 },
  { type: "awaiting", name: "counterReview", value: 0 },
  { type: "ToDo", name: "counterTodo", value: 0 },
  { type: "done", name: "counterDone", value: 0 },
  { type: -1, name: "counterUrgent", value: 0 }
];

/**
 * The function initializes the summary page by including HTML, loading data from the server, setting
 * active navigation, loading counters, setting welcome message, current user, and deadline.
 */
async function initSummary() {
  await includeHTML();
  await loadDataFromServer();
  handleWelcomeOnMobile();
  setActive("nav-summary");
  loadAllCounters();
  setWelcomeMsg();
  setCurrentUser();
  setDeadline();
}

/**
 * This function checks if the user is logged in and displays a welcome message on mobile devices
 * before hiding it after a certain delay.
 */
function handleWelcomeOnMobile() {
  let isLogin = localStorage.getItem("userLogIn");
  if (!isLogin) {
    window.location.href = "/index.html";
  }
  const windowWidth = window.innerWidth;
  const delay = welcomeMsgTrans + welcomeMsgDelay + 100;
  if (windowWidth <= mobileMaxWidth) {
    const welcome = document.getElementById("welcome-mobile");
    welcome.classList.remove("d-none");

    setTimeout(() => {
      welcome.classList.add("d-none");
    }, delay);
  }
}

/**
 * Checking if guest log in, else Loading currentUser and changing welcome message
 */
function setCurrentUser() {
  userLogIn = localStorage.getItem("userLogIn", userLogIn);
  if (userLogIn == null || userLogIn == 0) {
    document.getElementById("welcome-name-mobile").innerHTML = "";
    document.getElementById("welcome-name-desk").innerHTML = "";
  } else {
    document.getElementById("welcome-name-mobile").innerHTML =
      users[userLogIn].name;
    document.getElementById("welcome-name-desk").innerHTML =
      users[userLogIn].name;
  }
}

/**
 * The function loads all counters by looping through tasks and counter types and updating their
 * values.
 */
function loadAllCounters() {
  for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < counter.length; j++) {
      counter[j].value += counterLoop(i, counter[j].type);
    }
  }
  renderCounter();
}

/**
 * counts the tasks with right state or priority
 * @param {INT} id ID of the task
 * @param {STRING} name state or priority
 * @returns
 */
function counterLoop(id, name) {
  if (tasks[id].state == name || tasks[id].priority == name) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * load board.html with delay. Backend delete files without delay
 */
function goToBoard() {
  loadPageWithDelay("./board.html");
}

/**
 * load board.html with delay. Backend delete files without delay
 */
function goToSummary() {
  loadPageWithDelay("./summary.html");
}

/**
 * search the smallest value for deadline and set it on html
 */
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
