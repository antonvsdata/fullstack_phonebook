require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (req, res) => {
  Person.getAll().then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => res.status(404).end());
});

app.delete("/api/persons/:id", (req, res) => {
  Person.remove({ _id: req.params.id }).then((res) => res.status(204).end());
});

app.get("/info", (req, res) => {
  const nPersons = persons.length;
  const curDate = new Date();
  res.send(`<p>Phonebook has info for ${nPersons} people</p>
  <p>${curDate}</p>`);
});

app.post("/api/persons", (req, res) => {
  const person = new Person({
    ...req.body,
    id: Math.round(Math.random() * 1e7),
  });
  // Name and number must be specified
  let errorMsg = "";
  if (!person.name) {
    errorMsg = errorMsg.concat("name is missing");
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
  person.save().then((savedPerson) => res.json(savedPerson));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
