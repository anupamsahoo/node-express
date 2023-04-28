require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
//const Note = require("./models/note");
const Person = require("./models/person");

const app = express();

app.use(express.static("build-phonebook"));
app.use(express.json());
app.use(cors());

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

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  console.log(request.body);
  const person = new Person({
    name: body.name,
    date: new Date().toJSON(),
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    date: new Date().toJSON(),
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  //const id = Number(request.params.id);
  const del_id = request.params.id;
  Person.findByIdAndRemove(del_id)
    .then((person) => {
      if (person) {
        //response.json(person);
        response.status(204).end();
      } else {
        response.status(204).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/api/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const personDetail = `Phonebook Has info for ${persons.length} people`;
      //const checkTime = new Date().toTimeString();toUTCString()
      const checkTime = new Date().toString();

      const res = `${personDetail}\n\n${checkTime}`;
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end(res);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
