async function initialisation() {
  let loaded = await loadBackend(`users`);
  console.log(loaded);
  for (let i = 0; i < loaded.length; i++) {
    users.push(loaded[i]);
  }
  console.log(users);
}

function signUp() {
  const email = document.getElementById("email").value.toLowerCase();
  const password = document.getElementById("password").value;

  for (let i = 0; i < users.length; i++) {
    if (email == users[i].email) return 1;
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
}

/*
USERS{
id : INT,
name : STRING,
email : STRING, → VALIDIERUNG!!!
password : STRING,
picture : URL
phone : STRING
}
*/
