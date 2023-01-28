function test() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let user = {
    email: "",
    password: ""
  };

  user.email = email;
  user.password = password;

  console.log(user);
  users.push(user);
  console.log(users);
  backend.setItem("users", JSON.stringify(users));
}

async function test2(load) {
  let loaded = await backend.getItem(load);
  console.log(loaded);
  let data = JSON.parse(loaded);
  console.log(data);
}

function test3(task) {
  tasks.push(task);
}
