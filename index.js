const express = require("express");
const app = express();
app.use(express.json());

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

const generateId = () => Math.floor(Math.random() * 100000);

app.get("/info", (req, res) => {
  const date = new Date();
  const html = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toDateString()} ${date.toTimeString()}</p>
  `;

  res.send(html);
});

app.get("/api/persons", (req, res) => {
  console.log("api/persons");
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    return res.status(404).send({ error: "Person does not exist" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    persons = persons.filter((person) => person.id !== id);
  }

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on post ${PORT}`);
});
