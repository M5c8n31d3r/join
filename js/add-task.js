async function initAddTask() {
  await includeHTML();
  await loadDataFromServer();
  // activeSummaryNavLink();
}

function saveTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  let task = {
    id: tasks.length,
    title: title,
    description: description,
    state: "ToDo"
  };
  tasks.push(task);
  backend.setItem("tasks", tasks);
  setTimeout(loadDelay, 1000);
}

function loadDelay() {
  window.location.assign("./board.html");
}
