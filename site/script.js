// Hämtar element där recepten ska läggas
const recipesElement = document.getElementById("recipes");

// Lägger till eventlistener som lyssnar om man tryck på Spara-knappen
recipeForm.addEventListener("submit", onSubmit)

// Instantierar API för att prata med servern
const api = new Api("http://localhost:5000/coffee");

// Funktion som anropas när man sparar
function onSubmit(e) {
  // Bootstrap verkar strula med att inte ladda om sidan vid knapptryckning
  e.preventDefault();
  saveRecipe();
}

// Funktion som skapar ett receptobjekt som skickas till servern via API, ritar upp den nya listan
function saveRecipe() {
  var title = recipeForm[0].value;
  var description = recipeForm[1].value;

  const recipe = {
    title: title,
    description: description
  };

  api.create(recipe).then((result) => {
    if (result) {
      renderList();
    }
  });
}

// Ritar ut recepten i listan
function renderList() {
  api.getAll().then((recipes) => {
    recipesElement.innerHTML = "";
    if (recipes && recipes.length > 0) {
      recipes.forEach((r) => {
        recipesElement.insertAdjacentHTML("beforeend", renderRecipes(r));
      });
    }
  });
}

// Returnerar HTML för hur recepten ska se ut på sidan
function renderRecipes({ id, title, description }) {
  let html = `
      <div class="card col-3" style="width: 18rem;">
      <!-- <img src="..." class="card-img-top" alt="..."> -->
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <input class="btn btn-danger" onclick="deleteRecipe(${id})" value="Ta bort" />
      </div>
    </div>`;

  return html;
}

// Tar emot ett ID och skickar ett delete-request till servern via API:et
function deleteRecipe(id) {
  api.remove(id).then(() => {
    renderList();
  });
}

// Hämtar och visar recepten när sidan laddas
renderList();
