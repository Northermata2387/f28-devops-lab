const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'b383d742caa44456ac43b83f1b8cb0b3',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Hairy Crab', 'Sweet Ya Bao', 'Yunnan Black', 'Honey Orchid', 'Tie Guan Yin', 'Jin Jun Mei']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

//allows us to see any student names in our system
app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

//allows to post student details or cretae a student name
app.post('/api/students', (req, res) => {
   let {name} = req.body
   let max_chars = 24;

   const index = students.findIndex(student => {
       return student === name
   })

   try {

       if (name.length > max_chars) {
           rollbar.critical('name is to long')
           res.status(400).send('name is to long')
       }  else if (name === ''){
           rollbar.critical('No tea name was typed')
           res.status(400).send('You must enter a name.')
       }  else if (index === -1 && name !== ''){
           students.push(name)
           rollbar.log('Tea name was added')
           res.status(200).send(students)
       }  else {
           rollbar.warning('Tea name is already on the list')
           res.status(400).send('Tea name is on the list.')
       }
   } catch (err) {
       console.log(err)
   }
})

//allows us to delete the student post
app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.info('Tea name removed')
    rollbar.critical('testing critical link')
    res.status(200).send(students)
})

//not sure what port heroku will use or || well suggest the port if necessary
const port = process.env.PORT || 5050

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Server listening on ${port}`))


