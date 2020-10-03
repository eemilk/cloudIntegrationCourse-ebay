//var ItemInfo = 'models/itemInfo.js'
//var UserInfo = 'models/userInfo.js'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const PORT = 3001

app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))
//app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`)
})

var users = []

var postings = []

/* ROUTES */

// Login
app.post('/login', (req, res) => {
    try {
        console.log(req.body)
        console.log(users)
        var UserInfo = req.body
        if (UserInfo.userName == null || UserInfo.password == null) {
            res.status(400).send("No username or password")
        }
        for (let i = 0; i < users.length; i++) {
            if (UserInfo.password == users[i].password && UserInfo.userName == users[i].userName) {
                res.status(200).send("Login success")
            }
        }
        res.status(401).send("Wrong password or username")
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Create user
app.post('/users', (req, res) => {
    try {
        console.log(req.body)
        var UserInfo = req.body
        users.push(UserInfo)
        res.status(200).send()
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Delete user
app.delete('/users/{id}', (req, res) => {
    try {
        console.log(req.body)
        var UserInfo = req.body
        for (let i = 0; i < 0; i++) {
            if (users[i].id == UserInfo.id) {
                users[i].remove()
                break
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Create item listing
app.post('/itemListings', (req, res) => {
    try {
        console.log(req.body)
        var ItemInfo = req.body
        items.push(ItemInfo)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Update item listing
app.put('/itemListings/{id}', (req, res) => {
    try {
        console.log(req.body)
        var ItemInfo = req.body
        for (let i = 0; i < postings.length; i++) {
            if (postings[i].id == ItemInfo.id) {
                postings[i] == ItemInfo
                break
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Delete item listing
app.delete('/itemListings/{id}', (req, res) => {
    try {
        console.log(req.body)
        var ItemInfo = req.body
        for (let i = 0; i < postings.length; i++) {
            if (postings[i].id == ItemInfo.id) {
                items[i].remove()
                break
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Search for items
app.get('/itemListings/search', (req, res) => {
    try {
        console.log(req.body)
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

/*---------------------------- FUNCTIONS ------------------*/

//Checks if authorization header is correct
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) { return res.sendStatus(401) }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { return res.sendStatus(403) }
        req.user = user
        next()
    })
}