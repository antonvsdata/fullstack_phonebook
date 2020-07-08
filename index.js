require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms -  :body'
  )
)
app.use(cors())
app.use(express.static('build'))

// Get all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error))
})

// Get a single person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Delete person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// Number of people in phonebook
app.get('/info', (req, res, next) => {
  const curDate = new Date()
  const nPersons = Person.find({})
    .countDocuments()
    .then((n) => {
      res.send(`<p>Phonebook has info for ${n} people</p>
      <p>${curDate}</p>`)
    })
    .catch((error) => next(error))
})

// Create new person
app.post('/api/persons', (req, res, next) => {
  const person = new Person({
    ...req.body,
    id: Math.round(Math.random() * 1e7),
  })
  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error))
})

// Update info
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// Handle nonexistant addresses
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Handle errors
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
