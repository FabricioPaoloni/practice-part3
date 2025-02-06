const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

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


let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//fetching all resources
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

//fetching a single resource
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if(note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.find(note => note.id !== id)

  response.status(204).end()
})



const generateId = () => {
  const maxId = notes.length > 0 
                ? Math.max(...notes.map(n => Number(n.id))) 
                : 0
  return String(maxId + 1)
}



app.post('/api/notes', (request, response)  => {
  const body = request.body

  if(!body.content){
    return response.status(400).json({
      error: 'content property missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId()
  }

  notes = notes.concat(note)
  // console.log(note)
  response.json(note)
})



//learning about MIDDLEWARE: creating a middleware to log handle unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).json({error: 'unkown endpoint. Try a different'})
} 
//using middleware
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})