require('dotenv').config()
const mongoose = require('mongoose')

const name = process.argv[3]
const number = process.argv[4]
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({

  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
})

if (process.argv[2] === undefined) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    return
  })
}else person.save().then( () => {
  console.log(`added ${name} numnber ${number} to phonebook`)
})
