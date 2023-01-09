const express = require("express");
const app = express();

const validate = require("validate.js");

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

const constraints = {
  title: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 100,
      message: "Titeln måste vara mellan 3 och 100 tecken"
    }
  },
  description: {
    presence: false,
    length: {
      maximum: 500,
      message: "Beskrivning får ej vara längre än 500 tecken"
    }
  },
  dueDate: {
    presence: true,
    length: {
      minimum: 1,
      message: "Utfört senast datum måste finnas"
    }
  }
}

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
    const task = req.body;
    let validationErrors = validate(task, constraints, { fullMessages: false });
    console.log(validationErrors);

    if (validationErrors) {
      return res.status(400).send(validationErrors);
    }

    const listBuffer = await fs.readFile("./coffee.json");
    const currentcoffee = JSON.parse(listBuffer);
    let maxTaskId = 1;
    if (currentcoffee && currentcoffee.length > 0) {
      maxTaskId = currentcoffee.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    const newTask = { id: maxTaskId + 1, ...task };
    const newList = currentcoffee ? [...currentcoffee, newTask] : [newTask];

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
    const currentcoffee = JSON.parse(listBuffer);
    if (currentcoffee.length > 0) {
      await fs.writeFile(
        "./coffee.json",
        JSON.stringify(currentcoffee.filter((task) => task.id != id))
      );
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: "Ingen uppgift att ta bort" });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

// Uppdatera recept*
app.patch("/coffee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile("./coffee.json");
    const currentcoffee = JSON.parse(listBuffer);
    if (currentcoffee.length > 0) {
      var t = currentcoffee.find((task) => task.id == id);
      t.completed = !t.completed;

      await fs.writeFile(
        "./coffee.json",
        JSON.stringify(currentcoffee)
      );
      res.send({ message: `Uppgift med id ${id} sattes till ${t.completed}` });
    } else {
      res.status(404).send({ error: "Ingen uppgift att ändra" });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.listen(PORT, () => console.log("Server running on http://localhost:5000"));
