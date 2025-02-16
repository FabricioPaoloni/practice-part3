const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://paolonifabricio:${password}@practice.grcxm.mongodb.net/appNotes?retryWrites=true&w=majority&appName=practice`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is easy',
    important: true
})

note.save().then(result => {
    console.log('Note saved!')
    mongoose.connection.close()
})