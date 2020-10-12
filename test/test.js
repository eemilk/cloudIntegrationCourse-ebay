const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../index');


const expect = require('chai').expect;
const assert = require('chai').assert;
const apiAddress = 'http://localhost:3000';




//User creation tests
describe('User creation', function() {

    it('Should create a user', async function() {
        await  chai.request(apiAddress)
        .post('/users')
        .send({
            userName: 'userName1',
            name: 'Pekka',
            address: {
                streetAddress: 'streetAddress',
                country: 'FI',
                postalCode: '12300',
                city: 'Oulu'
            },
            email: 'pekka@pekka.com',
            birthDate: '2015-06-06',
            password: 'password'
        })
        .then(response => {
            expect(response.status).to.equal(200)
        })
        .catch(error =>{
            expect.fail(error)
        })
        
    })
    

    it('should fail with missing username', async function() {
        await chai.request(apiAddress)
            .post('/users')
            .send({
                name: 'Pekka',
                address: {
                    streetAddress: 'streetAddress',
                    country: 'FI',
                    postalCode: '12300',
                    city: 'Oulu'
                },
                email: 'pekka@pekka.com',
                birthDate: '2015-06-06',
                password: 'password'
            })
            .then(response => {
                expect(response.status).to.equal(400)
            })
            .catch(error => {
                throw error
            })
    })

    it('should fail with missing password', async function() {
        await chai.request(apiAddress)
            .post('/users')
            .send({
                userName: 'userName',
                name: 'Pekka',
                address: {
                    streetAddress: 'streetAddress',
                    country: 'FI',
                    postalCode: '12300',
                    city: 'Oulu'
                },
                email: 'pekka@pekka.com',
                birthDate: '2015-06-06',
            
            })
            .then(response => {
                expect(response.status).to.equal(400)
            })
            .catch(error => {
                throw error
            })
    })

    it('should fail with missing email', async function() {
        await chai.request(apiAddress)
            .post('/users')
            .send({
                userName: 'userName',
                name: 'Pekka',
                address: {
                    streetAddress: 'streetAddress',
                    country: 'FI',
                    postalCode: '12300',
                    city: 'Oulu'
                },
                birthDate: '2015-06-06',
                password: 'password'
            
            })
            .then(response => {
                expect(response.status).to.equal(400)
            })
            .catch(error => {
                throw error
            })
    })
})

//Login tests 
describe('Login', function (){
    it('should login successfully', async function() {
        await chai.request(apiAddress)
        .get('/login')
        .auth('testi', 'testi')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('jwt');
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with incorrect username', async function() {
        await chai.request(apiAddress)
        .post('/login')
        .auth('WronguserName','testi')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with incorrect password', async function() {
        await chai.request(apiAddress)
        .post('/login')
        .auth('testi','wrongpassword')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with missing username', async function() {
        await chai.request(apiAddress)
        .post('/login')
        .auth(null,'password')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with missing password', async function() {
        await chai.request(apiAddress)
        .post('/login')
        .auth('userName',null)
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            throw error
        })
    })

})
 
//User delete tests
describe('delete user', function() {
    
    let userJwt = null;
    let decodedJwt = null;
    
    before(async function(){
        await chai.request(apiAddress)
        .get('/login')
        .auth('testi', 'testi')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('jwt');
            
            userJwt = response.body.jwt;
            decodedJwt = jsonwebtoken.decode(userJwt, { complete: true })
        })
    })
    
    
    
    it('should delete user', async function() {
        await chai.request(apiAddress)
            .delete('/users/' + decodedJwt.payload.user.id)
            .set('Authorization', 'Bearer ' + userJwt)
            .then(deleteResponse => {
                expect(deleteResponse).to.have.property('status')
                expect(deleteResponse.status).to.equal(200)
                return chai.request(apiAddress)
                    .get('/login')
                    .auth('testi', 'testi')
                    
            })
            .then(newLoginResponse => {
                expect(newLoginResponse).to.have.property('status')
                expect(newLoginResponse.status).to.equal(401)

                return chai.request(apiAddress)
                .post('/users')
                .send({
                userName: 'testi',
                name: 'testi',
                address: {
                    streetAddress: 'streetAddress',
                    country: 'FI',
                    postalCode: '12300',
                    city: 'Oulu'
                },
                email: 'pekka@pekka.com',
                birthDate: '2015-06-06',
                password: 'password'
        })
        .then(response => {
            expect(response.status).to.equal(200)
        })
        .catch(error =>{
            assert.fail(error)
        })
            })
            .catch(error => {
                throw error
            }) 
    })
})

    


//Create item listing
describe('Item listing creation', function() {
    let userJwt = null;
    let decodedJwt = null;
    
    before(async function(){
        await chai.request(apiAddress)
        .get('/login')
        .auth('testi', 'testi')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('jwt');
            
            userJwt = response.body.jwt;
            decodedJwt = jsonwebtoken.decode(userJwt, { complete: true })
        })
    })

    it('Should create a item listing', async function() {
        await chai.request(apiAddress)
        .post('/itemListings')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({
            title: 'Peruna',
            description: 'Hieno peruna',
            price: 0.55,
            deliveryType: 'pickup'
        })
        .then(response => {
            expect(response.status).to.equal(200)
        })
        .catch(error =>{
            assert.fail(error)
        })
    })

})



//get information of item listings
describe('get information of item listings',  function() {
    let itemId = null
    it('Should get information of item listings', async function() {
        await chai.request(apiAddress)
        .get('/itemListings')
        .then(response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.a('object')
            expect(response.body).to.have.property('postings')
            expect(response.body.postings).to.be.a('array')
            itemId = response.body.postings
        })
        .catch(error => {
            assert.fail(error)
        })
    })

})


// Modify item listings
describe('Modfify item listings', function() {
    
    
    let userJwt = null;
    let decodedJwt = null;
    
    before(async function(){
        await chai.request(apiAddress)
        .get('/login')
        .auth('testi', 'testi')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('jwt');
            
            userJwt = response.body.jwt;
            decodedJwt = jsonwebtoken.decode(userJwt, { complete: true })
        })
    })
    

    it('Should update item listings successfully',async function(){
        await chai.request(apiAddress)
        .put('/itemlistings/' + 1234)
        .set('Authorization', 'Bearer ' + userJwt)
        .send({
            title: 'Peruna',
            description: 'Tosi Hieno peruna',
            price: 0.65,
            deliveryType: 'pickup'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
        })
        .catch(error => {
            assert.fail(error)
        })

    })

    it('Should fail if item listings cannot be found',async function(){
        await chai.request(apiAddress)
        .put('/itemlistings/' + 23454345)
        .set('Authorization', 'Bearer ' + userJwt)
        .send({
            title: 'Peruna',
            description: 'Tosi Hieno peruna',
            price: 0.65,
            deliveryType: 'pickup'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(401)
        })
        .catch(error => {
            assert.fail(error)
        })
    })

    it('Should delete item listing',async function(){
        await chai.request(apiAddress)
        .delete('/itemlistings/' + 1234)
        .set('Authorization', 'Bearer ' + userJwt)
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
        })
        .catch(error => {
            assert.fail(error)
        })
    })

    it('Should fail if item listings cannot be found',async function(){
        await chai.request(apiAddress)
        .delete('/itemlistings/' + 23454345)
        .set('Authorization', 'Bearer ' + userJwt)
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(401)
        })
        .catch(error => {
            assert.fail(error)
        })
    })



})

// search for items
describe('Search for items',  function(){
    
    let userJwt = null;
    let decodedJwt = null;
    
    before(async function(){
        await chai.request(apiAddress)
        .get('/login')
        .auth('testi', 'testi')
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('jwt');
            
            userJwt = response.body.jwt;
            decodedJwt = jsonwebtoken.decode(userJwt, { complete: true })
        })
    })
    
    
    it('Should search for items based on category', async function(){
        await chai.request(apiAddress)
        .get('/itemListings/search')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({ category: 'kodinkoneet'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.a('object')
            expect(response.body).to.have.property('foundList')
            expect(response.body.postings).to.be.a('array')
        })
        .catch(error => {
            assert.fail(error)
        })
    })

    it('should fail if category not found', async function(){
        await chai.request(apiAddress)
        .get('/itemListings/search')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({ category: 'kodinkoneet'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            assert.fail(error)
        })
    })
    it('Should search for items based on location', async function(){
        await chai.request(apiAddress)
        .get('/itemListings/search')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({ location: 'FI'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.a('object')
            expect(response.body).to.have.property('foundList')
            expect(response.body.postings).to.be.a('array')
        })
        .catch(error => {
            assert.fail(error)
        })
    })

    it('should fail if no items in given location found', async function(){
        await chai.request(apiAddress)
        .get('/itemListings/search')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({ location: 'USA'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            assert.fail(error)
        })
    })

    it('Should search for items based on date', async function(){
        await chai.request(apiAddress)
        .get('/itemListings/search')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({ date: '2020-08-06'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.be.a('object')
            expect(response.body).to.have.property('foundList')
            expect(response.body.postings).to.be.a('array')
        })
        .catch(error => {
            assert.fail(error)
        })
    })
    it('should fail if no items in given date found', async function(){
        await chai.request(apiAddress)
        .get('/itemListings/search')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({ date: '2020-08-07'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            assert.fail(error)
        })
    })
    
    
})

