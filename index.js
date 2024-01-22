require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const People = require('./models/person')

morgan.token('type', function(req) {
  return  JSON.stringify(req.body)
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('build'))


const errorHandler = (error, request, response, next) => {
  if( error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }   else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
let infoResponse = `<p>Phonebook has info for ${People.length} people </p> <br /> ${Date()}`

app.get('/api/people', (request, response) => {
  People.find({}).then(people => {
    response.json(people)
  })
})
app.get('/info', (request, response) => {
  response.send(infoResponse)
})
app.get('/api/people/:id', (request, response, next) => {


  People.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
  People.findByIdAndDelete(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.post('/api/people', (request, response, next) => {
  const body = request.body

  if(body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new People({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/people/:id', (request, response, next) => {
  const { name, number } = request.body
  People.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('server run')
})