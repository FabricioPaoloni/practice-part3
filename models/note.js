const mongoose = require('mongoose')

// MONGOOSE definition starts

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)

console.log("connecting to", url)

mongoose.connect(url)
        .then(result => {
            console.log("connected to DB")
        })
        .catch((error => {
            console.log("Error connecting to MongoDB:", error.message)
        }))

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Note = mongoose.model('Note', noteSchema)

module.exports = mongoose.model('Note', noteSchema)

// MONGOOSE definition ends