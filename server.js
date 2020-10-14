//var ItemInfo = 'models/itemInfo.js'
//var UserInfo = 'models/userInfo.js'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
//const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt
const jwtSecretKey = require('./jwt-key.json')

const PORT = process.env.PORT || 3001

app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))
//app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`)
})

/*passport.use(new BasicStrategy(async function(username, password, done) {
    
    const user = users.find(u => u.username == username)
    if(user == undefined){
        return done(null, false, { message: "HTTP Basic username not found" })
    }
    if(bcrypt.compareSync(password, user.password) == false) {
        // Password does not match
        console.log("HTTP Basic password not matching username");
        return done(null, false, { message: "HTTP Basic password not found" });
      }
    return done(null, user);


}))*/


let options = {}

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = jwtSecretKey.secret

passport.use(new JwtStrategy(options, function(jwt_payload, done){
    console.log(jwt_payload)

    const now = Date.now() / 1000;
    if(jwt_payload.exp > now) {
    done(null, jwt_payload.user);
    }
    else {// expired
        done(null, false);
    }
}));


var users = [
    {
        username: 'testi',
        email: 'testi@example.com',
        password: 'testi', 
        id: 1234
    }
]

var postings = [ 
    {
        id: 1234,
        title: 'Peruna',
        description: 'Tosi Tosi Hieno peruna',
        price: 0.65,
        deliveryType: 'pickup'
    }
]


/* ROUTES */
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// Login passport.authenticate('basic', {session:false}),
app.get('/login',  (req, res) => {
    try {
        
        var UserInfo = req.body

        const body = {
            id: UserInfo.id
        }

        const payload = {
            user: body
        }

        const options = {
            expiresIn: '1d'
        }
        const token = jwt.sign(payload, jwtSecretKey.secret, options)
        
        
        for (let i = 0; i < users.length; i++) {
            if (UserInfo.password == users[i].password && UserInfo.userName == users[i].userName) {
                
                res.status(200).json({jwt: token})
                break
            }
        }
        if (UserInfo.userName == null || UserInfo.password == null) {
            res.status(404).send("No username or password")
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
        //console.log(req.body)
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
app.delete('/users/:id',passport.authenticate('jwt', {session:false}), (req, res) => {
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
            res.status(401).send("User could not be deleted")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Create item listing
app.post('/itemListings',passport.authenticate('jwt', {session:false}), (req, res) => {
    try {
        console.log(req.body)
        var ItemInfo = req.body
        ItemInfo.id = uuidv4()
        postings.push(ItemInfo)
        res.status(200)
        res.json({id: postings[postings.length - 1].id})
        
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

app.get('/itemListings', (req, res) => {
    res.status(200)
    res.json({postings})

})

// Update item listing
app.put('/itemListings/:id',passport.authenticate('jwt', {session:false}), (req, res) => {
    try {
        console.log(req.params.id)
        var id = req.params.id
        var ItemInfo = req.body
        for (let i = 0; i < postings.length; i++) {
            if (postings[i].id == id) {
                postings[i] == ItemInfo
                res.status(200).send()
            }
        }
        res.status(401).send("Item you are trying to update cannot be found")
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Delete item listing
app.delete('/itemListings/:id',passport.authenticate('jwt', {session:false}), (req, res) => {
    try {
        console.log(req.body)
        var id = req.params.id
        var ItemInfo = req.body
        for (let i = 0; i < postings.length; i++) {
            if (postings[i].id == id) {
                postings.splice(i, 1)
                res.status(200).send()
            }
        }
        res.status(404).send("Item you are trying to update cannot be found")
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

// Search for items
app.get('/itemListings/search',passport.authenticate('jwt', {session:false}), (req, res) => {
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
            res.status(200).send({foundList})
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



