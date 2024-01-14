require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

morgan.token('type', function(req, res) { 
    return  JSON.stringify(req.body)
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('build'))



// const Person = mongoose.model('Person', personSchema)

// const person = new Person({
  
//     name: name,
//     number: number
// })

// if (process.argv[2] == undefined) {
//     console.log('phonebook:');
//     Person.find({}).then(result => {
//     result.forEach(person => {
//       console.log(`${person.name} ${person.number}`)
//     })
//     mongoose.connection.close()
//     return
//   })
// }else person.save().then(result => {
//     console.log(`added ${name} numnber ${number} to phonebook`);
//     mongoose.connection.close()
// })



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
    Person.find({}).then(people => {
        response.json(people)
    })
})
app.get('/info', (request, response) => {
    response.send(infoResponse)
})
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter( person => person.id !== id )

    response.status(204).end()
})
app.post('/api/persons', (request, response) => {
    const body = request.body

    if(body.name === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server run');
})