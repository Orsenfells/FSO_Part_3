
const express = require('express')
const morgan = require('morgan')
const app = express()


morgan.token('type', function(req, res) { 
    return  JSON.stringify(req.body)
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
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
let infoResponse = `<p>Phonebook has info for ${phonebook.length} people </p> <br /> ${Date()}`
let generateId = () => Math.floor(Math.random() * 99999999999999)

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})
app.get('/info', (request, response) => {
    response.send(infoResponse)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter( person => person.id !== id )

    response.status(204).end()
})
app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({error: 'name missing'})
    } else if (phonebook.find(number => number.name === person.name)) {
        return response.status(400).json({error: 'Name must be unique'})
    }

    person.id = generateId();
    phonebook = phonebook.concat(person)
    response.json(phonebook)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log('server run');
})