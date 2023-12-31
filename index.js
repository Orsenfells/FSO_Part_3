const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
// morgan.token('name', (req, res) => { return 'sda'})
morgan.token('type',  (req, res) => { 
    // console.log(req.headers);
    return JSON.stringify(req.body) })
let persons = [
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

app.get('/', (request, response) => {
    response.send('<h1>Hey Hey</h1>')
})
app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

const info = () => `<p>persons has info for ${persons.length} people</p>
                    <p>${Date()}</p>`
app.get('/info', (request, response) => { 
response.send(info())
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    console.log(person);
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()

    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
     persons = persons.filter(person => person.id !== id)

     console.log(persons);
    response.status(404).end()
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if(persons.find(person => person.name === body.name))  {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * (1000000 - 1) + 1)   
    }

    persons = persons.concat(person)

    response.json(person)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`server runninzzg on port `);
})