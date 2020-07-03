const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());
morgan.token("body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms -  :body"
  )
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.filter((per) => per.id === id);
  if (person.length) {
    res.json(person[0]);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.get("/info", (req, res) => {
  const nPersons = persons.length;
  const curDate = new Date();
  res.send(`<p>Phonebook has info for ${nPersons} people</p>
  <p>${curDate}</p>`);
});

app.post("/api/persons", (req, res) => {
  const person = { ...req.body };
  let errorMsg = "";
  if (!person.name) {
    errorMsg = errorMsg.concat("name is missing");
  } else {
    const names = persons.map((p) => p.name);
    if (names.includes(person.name)) {
      errorMsg = errorMsg.concat("name must be unique");
    }
  }
  if (!person.number) {
    errorMsg = errorMsg.concat(", number is missing");
    console.log(errorMsg);
  }
  if (errorMsg !== "") {
    console.log(errorMsg);
    return res.status(400).json({
      error: errorMsg,
    });
  }

  person.id = Math.round(Math.random() * 1e7);
  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
