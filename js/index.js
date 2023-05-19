let idForPasswordReset = 0;

/**
 * Initialisation after loading the page
 */
async function initialisation() {
  loadDataFromServer();
  loadDataFromLocalStorage();
}

/**
 * The function "signUp" takes user input for a username, email, and password, saves it to an object,
 * and checks for any errors.
 */
function signUp() {
  const userName = document.getElementById("usersignup").value;
  const email = document.getElementById("emailsignup").value.toLowerCase();
  const password = document.getElementById("passwordsignup").value;
  let user = {};
  cleanScreenErrors();
  checkInputAndSave(userName, email, password, user);
}

/**
 * The function checks user input and saves the user's information if it is valid and the user does not
 * already exist.
 * @param userName - A string representing the user's name.
 * @param email - The email input provided by the user during signup.
 * @param password - The password parameter is a string that represents the user's chosen password for
 * their account.
 * @param user - The parameter "user" is an object that represents a user. It contains the user's id,
 * name, email, password, and a boolean value indicating whether the user is a regular user or not.
 */
function checkInputAndSave(userName, email, password, user) {
  if (checkinput(userName, email, password)) {
    if (!getUserExist(email)) {
      user = {
        id: users.length,
        name: userName,
        email: email.toLowerCase(),
        password: password,
        isUser: true
      };
      saveUser(user);
      let timeout = setTimeout(function () {
        hideAlert("signup-infobox");
        switchscreen();
      }, 1000);
    } else {
      showAlert("signup-alert");
    }
  }
}

/**
 * The function saves a user's information, sets their initials, stores the information in the backend,
 * and displays a signup infobox alert.
 * @param user - The "user" parameter is an object that represents a user. It likely contains
 * properties such as "id", "name", "email", and "password". This function adds the user object to an
 * array called "users", sets the user's initials using their id, saves the updated "users"
 */
function saveUser(user) {
  users.push(user);
  setInitials(user.id);
  backend.setItem("users", users);
  showAlert("signup-infobox");
}

/**
 * The function checks if the input fields for username, email, and password are empty and returns a
 * boolean value.
 * @param userName - The username entered by the user during sign up.
 * @param email - The email parameter is a string that represents the email address entered by the user
 * during sign up.
 * @param password - The password parameter is a string that represents the user's password input.
 * @returns a boolean value (either true or false) depending on whether all three input parameters
 * (userName, email, and password) are not empty strings. If any of the input parameters are empty
 * strings, the function will call the showAlert function and return false.
 */
function checkinput(userName, email, password) {
  let check = true;
  if (userName == "") {
    showAlert("signup-username");
    check = false;
  }
  if (email == "") {
    showAlert("signup-email");
    check = false;
  }
  if (password == "" || password.length < 5) {
    showAlert("signup-password");
    check = false;
  }
  return check;
}

/**
 * The function cleans the screen of any error messages related to signing up.
 */
function cleanScreenErrors() {
  hideAlert("signup-alert");
  hideAlert("signup-username");
  hideAlert("signup-email");
  hideAlert("signup-password");
}

/**
 * The function signIn takes user input for email and password, checks if the user exists and logs them
 * in, and also checks if the "remember me" option is selected.
 */
function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let rememberMe = document.getElementById("rememberme").checked;
  let userID = getUserExist(email);
  checkUserAndLogin(userID, password);
  checkRememberMe(rememberMe, email, password);
}

/**
 * The function checks if the "remember me" option is selected and saves the user's email and password
 * in local storage if it is.
 * @param userID - The parameter "userID" is not being used in the function, so it is not relevant to
 * the functionality of the code.
 * @param email - The email address of the user.
 * @param password - The password parameter is a string that represents the user's password.
 */
function checkRememberMe(rememberMe, email, password) {
  if (rememberMe) {
    user = {
      email: email,
      password: password
    };
    localStorage.setItem("user", JSON.stringify(user));
  }
}

/**
 * The function checks the user ID and password, stores the user ID locally, and loads a summary page
 * with a delay if the login is successful.
 * @param userID - The user ID is a unique identifier assigned to each user in the system. It is used
 * to identify the user and retrieve their information from the database.
 * @param password - The password parameter is a string representing the password entered by the user
 * during the login process.
 */
function checkUserAndLogin(userID, password) {
  if (userID) {
    if (password == users[userID].password) {
      storeLocal(userID);
      loadPageWithDelay("./html/summary.html");
    } else {
      showAlert("signin-alert");
    }
  } else {
    showElement("signin-alert-user");
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
 * Store the id in localStorage
 * @param {INT} id -> ID of the user
 */
function storeLocal(id) {
  localStorage.setItem("userLogIn", id);
}

/**
 * switch type of input-field for password, to show and hide password.
 * switch the icon in the password-input-field
 * @param {STRING} passwordParameter HTML-ID of Password input field
 * @param {STRING} iconParameter HTML-ID of Icon in Password input field
 */
function swapPassword(passwordParameter, iconParameter) {
  let password = document.getElementById(passwordParameter);
  let icon = document.getElementById(iconParameter);

  if (password.type == "password") {
    password.type = "text";
    icon.src = "../assets/img/icons/icon-password-visible.svg";
  } else {
    password.type = "password";
    icon.src = "../assets/img/icons/icon-password-not-visible.svg";
  }
}

/**
 * Switch the screen between SignIn and SignUp
 */
function switchscreen() {
  let login = document.getElementById("login");
  let signup = document.getElementById("signup");
  let btn = document.getElementById("btn");

  cleanScreenErrors();

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
 * The function toggles the display of the login and password reset screens and the visibility of a
 * button.
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
 * ToDo: Email versand einrichten
 * Script sendet Email an feste Adresse, nicht an den Benutzer
 */
function sendNewPassword() {
  let email = document.getElementById("forgotpasswordemail");
  alert(email.value + " you will get a new password.");
}
