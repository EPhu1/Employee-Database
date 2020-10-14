const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { request } = require('express');
require('./Employee')

app.use(bodyParser.json())

const Employee = mongoose.model('employee')

const mongoUri = 'mongodb+srv://evanp:inlZaOKrBvObFGsS@cluster0.bbncf.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.connect(mongoUri, {
    useNewUrlParser: true
})

mongoose.connection.on('connected', () => {
    console.log('connected to mongo :)')
})
mongoose.connection.on('error', (err) => {
    console.log('error', err)
})

//Postman requests. Change the get/post accordingly.
app.get('/', (req, res) => {
    Employee.find({}).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
    })
})

//These are what get saved to mongodb.
app.post('/send-data', (req, res) => {
    // console.log(req.body)
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        picture: req.body.picture,
        salary: req.body.salary,
        position: req.body.position
    })
    employee.save()
    .then(data => {
        console.log(data)
        res.send(data) //this is what shows up on postman. We can send anything like 'res.send("data sent successfully")'
    })
    .catch(err => {
        console.log(err)
    })
})

app.post('/delete', (req, res) => {
    Employee.findByIdAndRemove(req.body.id)
    .then(data => {
        console.log(data)
        res.send(data)
    })
    .catch(err => {
        console.log(err)
    })
})

app.post('/update', (req, res) => {
    Employee.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        picture: req.body.picture,
        salary: req.body.salary,
        position: req.body.position
    })
    .then(data => {
        console.log(data)
        res.send(data)
    })
    .catch(err => {
        console.log(err)
    })
})

app.listen(3000, () => {
    console.log('server running')
});