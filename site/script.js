todoForm.title.addEventListener("keyup", (e) => validateField(e.target));
todoForm.title.addEventListener("blur", (e) => validateField(e.target));
todoForm.description.addEventListener("input", (e) => validateField(e.target));
todoForm.description.addEventListener("blur", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("input", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validateField(e.target));

todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById("todoList");

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api("http://localhost:5000/coffee");

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = "";

  switch (name) {
    case "title": {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case "description": {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrivning' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case "dueDate": {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove("hidden");
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((result) => {
    var validations = document.getElementById("validationErrors");

    validations.innerHTML = "";
    if (result && result.id) {
      renderList();
    } else {
      renderValidationErrors(result, validations);
    }
  });
}

function renderList() {
  api.getAll().then((tasks) => {
    todoListElement.innerHTML = "";
    tasks.sort(function (b, a) {
      return new Date(b.dueDate) - new Date(a.dueDate);
    });
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        todoListElement.insertAdjacentHTML("beforeend", renderTask(task));
        document
          .getElementById("taskCompleted" + task.id)
          .addEventListener("click", () => completedClicked(task));
        checkCompleted(task);
      });
    }
  });
}

function renderTask({ id, title, description, dueDate }) {
  let html = `
    <li class="select-none mt-2 py-2 border-b border-amber-300">
      <div class="flex items-center">
        <div>
          <input type="checkbox" class="mr-5" id="taskCompleted${id}" name="taskCompleted${id}">
        </div>
        <h3 id="titel${id}" class="flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-red-500 text-xs text-black-900 hover:bg-red-400 px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);
  html += `
    </li>`;

  return html;
}

function renderValidationErrors(errors, validations) {
  let html = `
    <ul>
  `;

  for (const key in errors) {
    html += `<li class="text-red-900">`;
    html += errors[key];
    html += "</li>";
  }

  html += `
  </ul>`;

  validations.insertAdjacentHTML("beforeend", html);
}

function completedClicked(task) {
  task.completed = !task.completed;
  checkCompleted(task);
  api.completedClicked(task);
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

function checkCompleted(task) {
  var el = document.getElementById("titel" + task.id);
  if (task.completed) el.classList.add("line-through", "lt-width");
  else el.classList.remove("line-through", "lt-width");

  var box = document.getElementById("taskCompleted" + task.id);
  box.checked = task.completed;
}

renderList();
