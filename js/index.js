let idForPasswordReset = 0;

/**
 * Initialisation after loading the page
 */
async function initialisation() {
  loadDataFromServer();
  loadDataFromLocalStorage();
}

/**
 * Save new user to the backend
 */
function signUp() {
  const userName = document.getElementById("usersignup").value;
  const email = document.getElementById("emailsignup").value.toLowerCase();
  const password = document.getElementById("passwordsignup").value;
  let user = {};

  if (!getUserExist(email)) {
    user = {
      id: users.length,
      name: userName,
      email: email.toLowerCase(),
      password: password,
      isUser: true
    };

    users.push(user);
    setInitials(user.id);
    backend.setItem("users", users);
    switchscreen();
  } else {
    showAlert("signup-alert");
  }
}

/**
 * If the Email and Password are correct, the user will get access
 */
function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let rememberMe = document.getElementById("rememberme").checked;
  let userID = getUserExist(email);

  if (userID) {
    if (password == users[userID].password) {
      storeLocal(userID);
      loadPageWithDelay("./html/summary.html");
    } else {
      showAlert("signin-alert");
    }
  } else {
    document
      .getElementById("signin-alert-user")
      .classList.remove("display-none");
  }

  if (rememberMe) {
    user = {
      email: email,
      password: password
    };
    localStorage.setItem("user", JSON.stringify(user));
  }
}

/**
 * LogIn as guest
 */
function signInGuest() {
  document.getElementById("email").required = false;
  document.getElementById("password").required = false;
  storeLocal(users[0].id);
  loadPageWithDelay("./html/summary.html");
}

/**
 *
 * @param {INT} id -> ID of the user
 * Store the id in localStorage
 */
function storeLocal(id) {
  localStorage.setItem("userLogIn", id);
}

/**
 *
 * @param {STRING} passwordParameter HTML-ID of Password input field
 * @param {STRING} iconParameter HTML-ID of Icon in Password input field
 *
 * switch type of input-field for password, to show and hide password.
 * switch the icon in the password-input-field
 */
function swapPassword(passwordParameter, iconParameter) {
  let password = document.getElementById(passwordParameter);
  let icon = document.getElementById(iconParameter);

  if (password.type == "password") {
    password.type = "text";
    icon.src = "/assets/img/icons/icon-password-visible.svg";
  } else {
    password.type = "password";
    icon.src = "/assets/img/icons/icon-password-not-visible.svg";
  }
}

/**
 * Switch the screen between SignIn and SignUp
 */
function switchscreen() {
  let login = document.getElementById("login");
  let signup = document.getElementById("signup");
  let btn = document.getElementById("btn");

  if (login.classList.contains("display-none")) {
    login.classList.remove("display-none");
    signup.classList.add("display-none");
    btn.classList.remove("display-none");
  } else {
    login.classList.add("display-none");
    signup.classList.remove("display-none");
    btn.classList.add("display-none");
  }
}

/**
 * switch the screen between SignIn and Forgot-Password
 */
function passwordReset() {
  let login = document.getElementById("login");
  let passwordreset = document.getElementById("forgotpasswordscreen");
  let btn = document.getElementById("btn");

  if (login.classList.contains("display-none")) {
    login.classList.remove("display-none");
    passwordreset.classList.add("display-none");
    btn.classList.remove("display-none");
  } else {
    login.classList.add("display-none");
    passwordreset.classList.remove("display-none");
    btn.classList.add("display-none");
  }
}

/**
 * ! NOCH NICHT FERTIG !
 * ToDo: Email versand einrichten
 */
function sendNewPassword() {
  let email = document.getElementById("forgotpasswordemail");
  alert(email.value);
}
