let musterUsers = [
  {
    id: 0,
    name: "guest",
    email: "guest@guest.de",
    password: "",
    picture: "",
    phone: ""
  },
  {
    id: 1,
    name: "Dennis Schneider",
    email: "dennis@schneider",
    password: "11111111",
    picture: "",
    phone: "+49 160 12345678"
  },
  {
    id: 2,
    name: "Michael Schneider",
    email: "michael@schneider",
    password: "12345678",
    picture: "",
    phone: "+49 168 87654321"
  },
  {
    id: 3,
    name: "Kay Beckmann",
    email: "kay@beckmann",
    password: "abcdef",
    picture: "",
    phone: "+49 1637 164850"
  },
  {
    id: 4,
    name: "Dori Mittermeyer",
    email: "dori@web.de",
    password: "abcdef",
    picture: "",
    phone: "+49 1637 164850"
  }
];

let musterTasks = [
  {
    id: 0,
    titel: "Muster Daten löschen",
    description:
      "Nachdem die Intigration des Backend läuft, können die Musterdaten gelöscht werden.",
    priority: -1,
    category: "ToDo",
    assignedTo: 3,
    dueDate: 1676358000, // 14.02.2023 08:00,
    state: "ToDo",
    subtask: [
      {
        done: false,
        description: "Musterdaten.js löschen"
      },
      {
        done: false,
        description: "Musterdaten.js aus index.js entfernen"
      }
    ]
  },
  {
    id: 1,
    titel: "Mobile first",
    description:
      "Alle Layouts werden erst für die Mobilansicht erstellt und dann für den Desktop optimiert",
    priority: 0,
    category: "ToDo",
    assignedTo: 1,
    dueDate: 1676358000, // 14.02.2023 08:00,
    state: "progress",
    subtask: []
  },
  {
    id: 2,
    titel: "Dritte Musteraufgabe",
    description: "Ich würde ja jetzt Lorem machen, aber das geht in js nicht",
    priority: 0,
    category: "done",
    assignedTo: 2,
    dueDate: 1676358000, // 14.02.2023 08:00,
    state: "done",
    subtask: [
      {
        done: false,
        description: "Musterdaten.js löschen"
      },
      {
        done: false,
        description: "Musterdaten.js aus index.js entfernen"
      }
    ]
  }
];

function resetMusterdaten() {
  users.splice(0, users.length);
  for (let i = 0; i < musterUsers.length; i++) {
    users.push(musterUsers[i]);
  }
  backend.setItem("users", users);

  tasks.splice(0, tasks.length);
  for (let i = 0; i < musterTasks.length; i++) {
    tasks.push(musterTasks[i]);
  }
  backend.setItem("tasks", tasks);
}
