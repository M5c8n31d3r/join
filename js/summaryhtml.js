/**
 * Sets the welcome message depending on the current time
 */
function setWelcomeMsg() {
  const currDate = new Date();
  const currHour = currDate.getHours();
  const welcomeTextDesk = document.getElementById("welcome-text-desk");
  const welcomeTextMobile = document.getElementById("welcome-text-mobile");
  let welcomeText = "";

  switch (true) {
    case currHour < 12:
      welcomeText = "Good morning!";
      break;
    case currHour >= 12 && currHour < 17:
      welcomeText = "Good afternoon!";
      break;
    case currHour >= 17:
      welcomeText = "Good evening!";
      break;
  }

  welcomeTextDesk.innerHTML = welcomeText;
  welcomeTextMobile.innerHTML = welcomeText;
}

/**
 * Generate the counter elements
 */
function renderCounter() {
  document.getElementById("board-counter").innerHTML = tasks.length;
  document.getElementById("progress-counter").innerHTML = counter[0].value;
  document.getElementById("feedback-counter").innerHTML = counter[1].value;
  document.getElementById("todo-counter").innerHTML = counter[2].value;
  document.getElementById("done-counter").innerHTML = counter[3].value;
  document.getElementById("urgent-counter").innerHTML = counter[4].value;
}
