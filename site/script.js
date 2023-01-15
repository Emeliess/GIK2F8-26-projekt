recipeForm.title.addEventListener("keyup", (e) => validateField(e.target));
recipeForm.title.addEventListener("blur", (e) => validateField(e.target));
recipeForm.description.addEventListener("input", (e) => validateField(e.target));
recipeForm.description.addEventListener("blur", (e) => validateField(e.target));

recipeForm.addEventListener("submit", onSubmit);

const recipesElement = document.getElementById("recipes");

let titleValid = true;
let descriptionValid = true;

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
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove("hidden");
}

function onSubmit(e) {
  e.preventDefault();
  //if (titleValid && descriptionValid && dueDateValid) {
    saveRecipe();
  //}
}

function saveRecipe() {
  const recipe = {
    title: recipeForm.title.value,
    recipe: recipeForm.description.value,
  };

  api.create(recipe).then((result) => {
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
  api.getAll().then((recipes) => {
    recipesElement.innerHTML = "";
    recipes.sort(function (b, a) {
      return new Date(b.dueDate) - new Date(a.dueDate);
    });
    if (recipes && recipes.length > 0) {
      recipes.forEach((r) => {
        todoListElement.insertAdjacentHTML("beforeend", renderTask(r));
        document
          .getElementById("recipeCompleted" + r.id)
          .addEventListener("click", () => completedClicked(r));
        checkCompleted(r);
      });
    }
  });
}

function renderTask({ id, title, description }) {
  let html = `
      <div class="card col-3" style="width: 18rem;">
      <!-- <img src="..." class="card-img-top" alt="..."> -->
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
      </div>
    </div>`;

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


function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}


renderList();
