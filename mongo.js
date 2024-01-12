const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument');
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://Admin:${password}@cluster0.txua3ql.mongodb.net/phonebook?retryWrites=true&w=majority`

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

if (process.argv[3] == undefined) {
    console.log('phonebook:');
    Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    return
  })
}else person.save().then(result => {
    console.log(`addedm ${name} numnber ${number} to phonebook`);
    mongoose.connection.close()
})

