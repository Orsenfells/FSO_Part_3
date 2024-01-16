require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const People = require('./models/person')

morgan.token('type', function(req, res) { 
    return  JSON.stringify(req.body)
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('build'))


const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if( error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }

    next(error)
}


let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
let infoResponse = `<p>Phonebook has info for ${People.length} people </p> <br /> ${Date()}`
let generateId = () => Math.floor(Math.random() * 99999999999999)

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

app.delete('/api/people/:id', (request, response) => {
    People.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
app.post('/api/people', (request, response) => {
    const body = request.body

    if(body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new People({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.put('/api/people/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }
console.log('test');
    People.findByIdAndUpdate(request.params.id, person, { new: true} )
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server run');
})