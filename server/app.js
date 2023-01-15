const express = require("express");
const app = express();

const fs = require("fs/promises");

const PORT = 5000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

// Hämta recept
app.get("/coffee", async (req, res) => {
  try {
    const coffee = await fs.readFile("./coffee.json");
    res.send(JSON.parse(coffee));
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Lägg till recept
app.post("/coffee", async (req, res) => {
  try {
    const recipe = req.body;
    
    const listBuffer = await fs.readFile("./coffee.json");
    const currentCoffees = JSON.parse(listBuffer);

    let maxTaskId = 1;
    if (currentCoffees && currentCoffees.length > 0) {
      maxTaskId = currentCoffees.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    const newTask = { id: maxTaskId + 1, ...recipe };
    const newList = currentCoffees ? [...currentCoffees, newTask] : [newTask];

    await fs.writeFile("./coffee.json", JSON.stringify(newList));
    res.send(newTask);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

// Ta bort recept
app.delete("/coffee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile("./coffee.json");
    const currentCoffees = JSON.parse(listBuffer);
    if (currentCoffees.length > 0) {
      await fs.writeFile(
        "./coffee.json",
        JSON.stringify(currentCoffees.filter((c) => c.id != id))
      );
      res.send({ message: `Recept med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: "Inget recept att ta bort" });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.listen(PORT, () => console.log("Server running on http://localhost:5000"));
