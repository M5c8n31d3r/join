async function initialisation() {
  loadDataFromServer();
}

function signUp() {
  const email = document.getElementById("email").value.toLowerCase();
  const password = document.getElementById("password").value;

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (email == users[i].email) return 1;
    }
  }

  let user = {
    id: users.length,
    email: email,
    password: password
  };

  users.push(user);
  backend.setItem("users", JSON.stringify(users));
  console.log(users);
  return 0;
}

function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  for (let i = 0; i < users.length; i++) {
    if (
      email.toLowerCase() == users[i].email &&
      password == users[i].password
    ) {
      userLogIn = users[i].id;
      window.location.assign("./html/summary.html");
    }
  }
}

function signInGuest() {
  document.getElementById("email").required = false;
  document.getElementById("password").required = false;
  userLogIn = users[0].id;
  window.location.assign("./html/summary.html");
}

function swapPassword() {
  let password = document.getElementById("password");
  if (password.type == "password") {
    password.type = "text";
  } else {
    password.type = "password";
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

function renderPasswordReset() {
  alert("Hier kommt die Seite für dein neues Passwort.");
}
