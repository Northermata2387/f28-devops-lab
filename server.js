const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors())

// // include and initialize the rollbar library with your access token
// var Rollbar = require('rollbar')
// var rollbar = new Rollbar({
//   accessToken: 'a5cfbfc7041f4392a5ebf6982e2081d7',
//   captureUncaught: true,
//   captureUnhandledRejections: true,
// })

// // record a generic message and send it to Rollbar
// rollbar.log('Hello world!')

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

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
        //    rollbar.log('Student was added sucessfully')
           res.status(200).send(students)
       } else if (name === ''){
            // rollbar.error('No name was provided')
           res.status(400).send('You must enter a name.')
       } else {
            // rollbar.error('Student is already in array')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

//allows us to delete the student post
app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    // rollbar.info('Student was deleted')
    res.status(200).send(students)
})

//not sure what port heroku will use or || well suggest the port if necessary
const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))


