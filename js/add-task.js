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
  listItems.innerHTML = "";
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
  filledCategory.innerHTML = fillCatergory(id);
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
  document.getElementById("dropdown-accept").classList.remove("display-none");
  document
    .getElementById("category-dropdown-arrow")
    .classList.add("display-none");

  document.getElementById("category-input").value = "";
  document.getElementById("category-input").select();
  document.getElementById("filled-category").classList.add("display-none");
  toggleDropdown();
}

function clearInput() {
  document.getElementById("new-category-colors").classList.add("display-none");
  document.getElementById("category-input").classList.add("display-none");
  document.getElementById("dropdown-accept").classList.add("display-none");
  document
    .getElementById("category-dropdown-arrow")
    .classList.remove("display-none");

  document.getElementById("filled-category").classList.remove("display-none");
  toggleDropdown();
}

function saveNewCategory() {
  let newCatValue = document.getElementById("category-input").value;
  let newCatColor =
    document.getElementById("new-category-color").style.backgroundColor;
  categories.push({
    id: categories.length + 1,
    name: newCatValue,
    color: newCatColor
  });
  loadCategories();
  let filledCategory = document.getElementById("filled-category");
  filledCategory.innerHTML = fillCatergory(categories.length - 1);
  filledCategory.classList.remove("display-none");
  document.getElementById("category-input").classList.add("display-none");
  document.getElementById("new-category-colors").classList.add("display-none");
  document.getElementById("dropdown-accept").classList.add("display-none");
  document
    .getElementById("category-dropdown-arrow")
    .classList.remove("display-none");
}

function addNewCatergoryColor(color) {
  let selectedColor = color;
  document.getElementById(
    "new-category-color"
  ).style.backgroundColor = `var(${selectedColor}`;
}

function fillCatergory(id) {
  return `
<div class="flex">
  <span>${categories[id]["name"]}</span>
  <div class="category-color" style="background-color: ${categories[id]["color"]}"></div>
</div>`;
}
