async function initialisation() {
  let download = await downloadFromServer();
  download = await JSON.parse(download);
  users.splice(0, users.length);
  for (let i = 0; i < download.users.length; i++) {
    users.push(download.users[i]);
  }
  console.log("fertig");
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

function renderSignUp() {
  alert("SignUp");
}

function renderPasswordReset() {
  alert("Hier kommt die Seite für dein neues Passwort.");
}
