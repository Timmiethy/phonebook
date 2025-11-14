import express from 'express'
import cors from 'cors'
const app = express()

app.use(cors())
app.use(express.json())

let  persons = [
    {
      "id": 1,
      "name": "Tu",
      "number": "435436",
      "gender": "female"
    },
    {
      "id": 2,
      "name": "Linh",
      "number": "32453",
      "gender": "female"
    },
    {
      "id": 3,
      "name": "Nhien",
      "number": "34543",
      "gender": "female"
    },
    {
      "id": 4,
      "name": "Tan",
      "number": "453454",
      "gender": "male"
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hellllo</h1>')
})

app.get('/persons', (req, res) => {
  res.json(persons)
}) 

app.delete('/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  persons = persons.filter(person => person.id !== id)
  res.json(person)
})

app.post('/persons', (req, res) => {
  const person = req.body
  const newId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) + 1 : 1
  const newPerson = {
    ...person,
    "id": newId
  }
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

app.put('/persons', (req, res) => {
  const body = req.body
  const name = body.name
  const person = persons.find(person => person.name === name)
  const update = {
    "id": person.id,
    "name": name,
    "number": body.number,
    "gender": body.gender
  }
  persons = persons.map(person => person.name !== name ? person : update)
  res.json(update)
})

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
  })