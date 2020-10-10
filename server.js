//var ItemInfo = 'models/itemInfo.js'
//var UserInfo = 'models/userInfo.js'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')


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
        if (UserInfo.password == null || UserInfo.userName == null || UserInfo.email == null) {
            res.status(400).send("Please provide all the needed info")
        } else {
            for (let i = 0; i < users.length; i++) {
                if (users[i].userName == UserInfo.userName) {
                    res.status(400).send("That username already exist")
                }
                if (users[i].email == UserInfo.email) {
                    res.status(400).send("That email already exist")
                }
            }
            UserInfo.id = uuidv4()
            users.push(UserInfo)
            res.status(200).send(UserInfo.id)            
        }
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Delete user
app.delete('/users', (req, res) => {
    try {
        console.log(req.body)
        var userFound = false;
        var UserInfo = req.body
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == UserInfo.id) {
                users.splice(i, 1)
                userFound = true;
                break
            }
        }
        if (userFound) {
            res.status(200).send("User deleted")
        } else {
            res.status(400).send("User could not be deleted")
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
        ItemInfo.id = uuidv4()
        postings.push(ItemInfo)
        res.status(200).send("Item created")
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Update item listing
app.put('/itemListings', (req, res) => {
    try {
        console.log(req.body)
        var ItemInfo = req.body
        for (let i = 0; i < postings.length; i++) {
            if (postings[i].id == ItemInfo.id) {
                postings[i] == ItemInfo
                res.status(200).send("Item is updated")
            }
        }
        res.status(400).send("Item you are trying to update cannot be found")
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Delete item listing
app.delete('/itemListings', (req, res) => {
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
        var itemIsfound = false
        var foundList = []
        var search = req.body.search
        for (let j = 0; j < postings.length; j++) {
            console.log(postings[j])
            itemIsfound = false;
            // Checks for name of that item
            if (search == postings[j].itemName) {
                itemIsfound = true
                foundList.push(postings[j])
            }
            // Checks for categories of that item if its not found already
            if (!itemIsfound) {
                for (let i = 0; i < postings[j].categories.length; i++) {
                    if (search == postings[j].categories[i]) {
                        itemIsfound = true
                        foundList.push(postings[j])
                    }
                }
            }
            // Checks of location of that item does it match
            if (!itemIsfound) {
                if (search == postings[j].location.country 
                    || search == postings[j].location.state || search == postings[j].location.city) {
                        itemIsfound = true
                        foundList.push(postings[j])
                    }
            }
            // Checks for seached date of that item does it match
            if (!itemIsfound) {
                if (search == postings[j].dateOfListing.slice(0, 10)) {
                    itemIsfound = true
                    foundList.push(postings[j])
                }   
            }
        }
        if (itemIsfound) {
            res.status(200).send(foundList)
        } else {
            res.status(404).send("No items found")
        }
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