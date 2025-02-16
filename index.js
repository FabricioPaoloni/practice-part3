const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

//learning about MIDDLEWARE: creating a middleware to log to console the request info
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path', request.path)
  console.log('body', request.body)
  console.log('------')
  next()
}
//middleware is used like: 
app.use(requestLogger)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//fetching all resources
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//fetching a single resource
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
      .then(note => {
        if(note){
          response.json(note)
        } else {
          response.status(404).end()
        }})
      .catch(error => next(error))
})


app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, {new: true})
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
})



app.post('/api/notes', (request, response)  => {
  const body = request.body

  if(!body.content){
    return response.status(400).json({
      error: 'content property missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false
  })
    
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  // console.log(note)
})



//learning about MIDDLEWARE: creating a middleware to log handle unknown routes
//this one must be at the end of the routes, otherwaise none of the routes would work
const unknownEndpoint = (request, response) => {
  response.status(404).json({error: 'unkown endpoint. Try a different'})
} 
//using middleware
app.use(unknownEndpoint)

//middleware to handle errors. The only middleware that can be AFTER inknownEndpoint middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === "CastError"){
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
//using the errorHandler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})