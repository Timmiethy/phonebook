import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {

// fecth db.json
  const [phoneBook, setPhoneBook] = useState([])
  useEffect(() => {
    console.log('fetching...')
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('fetched', response.data)
      setPhoneBook(response.data)
    })
  }, [])

// name state
  const [name, setName] = useState('')
  const handleChangeName = (event) => {
    console.log(event.target.value)
    setName(event.target.value)
  }

// display state
  const [displayState, setDisplayState] = useState(0)

// number state
  const [number, setNumber] = useState('')
  const handleChangeNumber = (event) => {
    console.log(event.target.value)
    setNumber(event.target.value)
  }

// gender state
  const [gender, setGender] = useState('')
  const handleChangeGender = (event) => {
    console.log(event.target.value)
    setGender(event.target.value)
  }

// display content
  const Display = ({state}) => {
    if(state === 0){
      return(
        <ShowAndDel persons = {phoneBook} />
      )
    }
    if(state === 1){
      const persons = phoneBook.filter(person => person.gender === "male")
      return(
        <ShowAndDel persons = {persons}/>
      )
    }
    if(state === 2){
      const persons = phoneBook.filter(person => person.gender === "female")
      return(
        <ShowAndDel persons = {persons} />
      )
    }
  }

  const ShowAndDel = ({persons}) => {
    return (
      <div>
        {persons.map(person => 
            <p key = {person.id}>{person.name}, {person.number}, {person.gender}  
              <button onClick = {() => handleDelete(person.id)} style = {{marginLeft: '8px'}}>Del</button>
            </p>
        )}
      </div>
    )
  }

  const handleDelete = (id) => {
    axios
    .delete(`http://localhost:3001/persons/${id}`)
    .then((response) => {
      console.log('deleted', response.data)
      setPhoneBook(phoneBook.filter(person => person.id !== id))
    })
  }

// button name
  const ButtonName = ({state}) => {
    if (state === 0) return <>show male</>
    if (state === 1) return <>show female</>
    if (state === 2) return <>show all</>
  }
  
// handle buttonName click
  const handleButtonNameClick = (event) => {
    setDisplayState(displayState+1)
    const curr = displayState+1
    if(curr === 3){
      setDisplayState(0)
    }
  }

// handle submit
  const handleSubmit = (event) => {
    event.preventDefault()
    
    // preprocess data
    const trimmedName = name.trim()
    const trimmedNumber = number.trim()
    const trimmedGender = gender.trim()

    // when name gets inserted
    if(name){

      // makes sure gender is either male or female
      if(gender !== "male" && gender !== "female"){
        alert('gender has to be either male or female')
        setGender('')
        return
      }

      // checks if name is already there
      const checkName = phoneBook.find(person => trimmedName.toLowerCase() === person.name.toLowerCase())

      // name already there & number is now different
      if (checkName && number !== checkName.number){
        // user confirms update
        if(window.confirm('Name already exists. Do you want to update information on this name?')){
          const objectPerson = {...checkName, name, number}
          axios
          .put(`http://localhost:3001/persons/${checkName.id}`, objectPerson)
          .then(response => {
            console.log('updated', response.data)
            setPhoneBook(phoneBook.map(person => person.id !== checkName.id ? person : response.data))
          })
        }
        else {
          setName('')
          setNumber('')
          setGender('')
        }
      }
      // name already there and number also has not changed -> alert 'try again'
      if (checkName && number === checkName.number){
        alert('Name already exists. Please try again.')
      }

      // new name -> post new data
      else if (!checkName){
        const objectPerson = {name, number, gender}
        axios
        .post('http://localhost:3001/persons', objectPerson)
        .then(response => {
          console.log('add', response.data)
          setPhoneBook(phoneBook.concat(response.data))
        })
      }
    }
    else{
      alert('Please insert a name.')
    }
      // reset
      setName('')
      setNumber('')
      setGender('')
  }


  return (
    <div>
      <h1>Phonebook</h1>
      
      <h2>Add Info</h2>
      <form>
        <div> name: <input value = {name} onChange = {handleChangeName}/> </div>
        <div> number: <input value = {number} onChange = {handleChangeNumber} /> </div>
        <div> gender (male/female): <input value = {gender} onChange = {handleChangeGender} /> </div>
        <button type = "submit" onClick = {handleSubmit}>Add</button>
      </form>
      <h2>List</h2>
      <div><button onClick = {handleButtonNameClick}><ButtonName state = {displayState} /></button></div>
      <Display state = {displayState} />
    </div>
  )
}

export default App