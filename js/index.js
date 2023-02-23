let idForPasswordReset = 0;

async function initialisation() {
  loadDataFromServer();
  loadDataFromLocalStorage();
}

function signUp() {
  const userName = document.getElementById("usersignup").value;
  const email = document.getElementById("emailsignup").value.toLowerCase();
  const password = document.getElementById("passwordsignup").value;
  let user = {};

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (email == users[i].email) {
        alert("Benutzer schon vorhanden");
        return 1;
      }
    }
  }

  user = {
    id: users.length,
    name: userName,
    email: email,
    password: password
  };

  users.push(user);
  backend.setItem("users", users);
  switchscreen();
}

function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let rememberMe = document.getElementById("rememberme").checked;

  for (let i = 0; i < users.length; i++) {
    if (
      email.toLowerCase() == users[i].email &&
      password == users[i].password
    ) {
      userLogIn = users[i].id;
      window.location.assign("./html/summary.html");
    }
  }
  if (rememberMe) {
    user = {
      email: email,
      password: password
    };
    localStorage.setItem("user", JSON.stringify(user));
  }
}

function signInGuest() {
  document.getElementById("email").required = false;
  document.getElementById("password").required = false;
  userLogIn = users[0].id;
  window.location.assign("./html/summary.html");
}

function swapPassword(passwordParameter, iconParameter) {
  let password = document.getElementById(passwordParameter);
  let icon = document.getElementById(iconParameter);

  if (password.type == "password") {
    password.type = "text";
    //! todo: Richtiges Icon noch einbinden !!!!
    icon.src = "/assets/img/icons/icon-name.svg";
  } else {
    password.type = "password";
    //! todo: Richtiges Icon noch einbinden !!!!
    icon.src = "/assets/img/icons/icon-urgent.svg";
  }
}

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

function sendNewPassword() {
  let email = document.getElementById("forgotpasswordemail");
  alert(email.value);
}

function loadDataFromLocalStorage() {
  if (localStorage.getItem("user")) {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    document.getElementById("email").value = user.email;
    document.getElementById("password").value = user.password;
    document.getElementById("rememberme").checked = true;
  }
}
