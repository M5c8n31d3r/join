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
  let filledCategory = document.getElementById("filled-category");
  filledCategory.innerHTML = `
      <div class="flex">
        <span>${categories[id]["name"]}</span>
        <div class="category-color" style="background-color: ${categories[id]["color"]}"></div>
      </div>`;
  filledCategory.classList.remove("display-none");
  document.getElementById("category-input").value = categories[id]["name"];
  document.getElementById("category-input").classList.add("display-none");
  document.getElementById("new-category-colors").classList.add("display-none");
  toggleDropdown();
}

function toggleDropdown() {
  let list = document.getElementById("dropdown-list-category");
  if (list.classList.contains("display-none")) {
    list.classList.remove("display-none");
  } else {
    list.classList.add("display-none");
  }
}

function newCategory() {
  document
    .getElementById("new-category-colors")
    .classList.remove("display-none");
  document.getElementById("category-input").classList.remove("display-none");
  document.getElementById("filled-category").classList.add("display-none");
  toggleDropdown();
}
