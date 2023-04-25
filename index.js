const express = require("express");
var morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static("build-phonebook"));

const notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2023-04-26T07:46:36.611Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2023-04-26T07:46:36.611Z",
    important: true,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2023-04-26T07:46:36.611Z",
    important: true,
  },
];

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

const m = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    tokens["response-time"](req, res),
    "ms",
    tokens.body(req, res),
  ].join(" ");
});

app.use(m);

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => id === p.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (body.name) {
    const chkName = persons.filter((p) => {
      return p.name === body.name;
    });
    if (chkName.length > 0) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }
  } else {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (body.number) {
    const chkNum = persons.filter((p) => {
      return p.number === body.number;
    });
    if (chkNum.length > 0) {
      return response.status(400).json({
        error: "number must be unique",
      });
    }
  } else {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  const p = persons.concat(person);
  response.json(p);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const persontoDelete = persons.filter((p) => id !== p.id);
  if (persontoDelete) {
    response.json(persontoDelete);
  } else {
    response.status(204).end();
  }
});

app.get("/info", (request, response) => {
  const personDetail = `Phonebook Has info for ${persons.length} people`;
  //const checkTime = new Date().toTimeString();toUTCString()
  const checkTime = new Date().toString();

  const res = `${personDetail}\n\n${checkTime}`;
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(res);
});

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
