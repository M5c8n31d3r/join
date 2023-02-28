let idForPasswordReset = 0;

async function initialisation() {
  loadDataFromServer();
  loadDataFromLocalStorage();
}

function signUp() {
  let userExist = false;
  const userName = document.getElementById("usersignup").value;
  const email = document.getElementById("emailsignup").value.toLowerCase();
  const password = document.getElementById("passwordsignup").value;
  let user = {};

  if (!getUserExist(email)) {
    user = {
      id: users.length,
      name: userName,
      email: email,
      password: password,
      isUser: true
    };

    users.push(user);
    setInitials(user.id);
    backend.setItem("users", users);
    switchscreen();
  } else {
    let error = document.getElementById("signup-error");
    error.classList.remove("display-none");
    error.innerHTML = "Email schon vorhanden!";
  }
}

function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let rememberMe = document.getElementById("rememberme").checked;

  for (let i = 0; i < users.length; i++) {
    if (
      email.toLowerCase() == users[i].email &&
      password == users[i].password &&
      users[i].isUser
    ) {
      storeLocal(users[i].id);
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
  storeLocal(users[0].id);
  window.location.assign("./html/summary.html");
}

function storeLocal(id) {
  localStorage.setItem("userLogIn", users[id].id);
}

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
