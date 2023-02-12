let categories = [
  { id: 1, name: "Marketing", color: "var(--orange)" },
  { id: 2, name: "Sales", color: "var(--light-blue)" },
  { id: 3, name: "Backoffice", color: "var(--red)" },
  { id: 4, name: "Product management", color: "var(--magenta)" }
];

async function initAddTask() {
  await includeHTML();
  await loadDataFromServer();
  loadCategories();
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

function loadCategories() {
  let listItems = document.getElementById("category-list");
  for (let i = 0; i < categories.length; i++) {
    let listItem = categories[i];
    listItems.innerHTML += `
      <div id='category-${listItem["id"]}' onclick='selectCategory(${
      listItem["id"] - 1
    })' class="dropdown-item flex">
        <span class="category-name">${listItem["name"]}</span>
        <div class="category-color" style="background-color: ${
          listItem["color"]
        }"></div>
      </div>`;
  }
}

function selectCategory(id) {
  document.getElementById("filled-category").innerHTML = `
      <div class="flex">
        <span>${categories[id]["name"]}</span>
        <div class="category-color" style="background-color: ${categories[id]["color"]}"></div>
      </div>`;
  document.getElementById("category-input").classList.add("display-none");
}