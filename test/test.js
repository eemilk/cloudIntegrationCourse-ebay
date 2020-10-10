const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../index');

const expect = chai.expect;
const apiAddress = 'http://localhost:3000';


//User creation tests
describe('User creation', function() {

    it('Should create a user', async function() {
        await chai.request(apiAddress)
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
            assert.fail(error)
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
        .send({username: 'testi', password: 'testi'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('id')
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
    let userId = null
    
    
    before(async function(){
        await chai.request(apiAddress)
        .get('/login')
        .send({username: 'testi', password: 'testi'})
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('id')
            userId = response.body.id
        })
    })
    
    
    
    it('should delete user', async function() {
        await chai.request(apiAddress)
            .delete('/users/' + userId)
            .send({id: userId}) 
            .then(deleteResponse => {
                expect(deleteResponse).to.have.property('status')
                expect(deleteResponse.status).to.equal(200)
                return chai.request(apiAddress)
                    .get('/login')
                    .send({
                        username: 'testi',
                        password: 'testi'
                    })
            })
            .then(newLoginResponse => {
                expect(newLoginResponse).to.have.property('status')
                expect(newLoginResponse.status).to.equal(404)
            })
            .catch(error => {
                throw error
            }) 
    })
})

    


//Create item listing
describe('Item listing creation', function() {
    
    
    it('Should create a item listing', async function() {
        await chai.request(apiAddress)
        .post('/itemListings')
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
            expect.fail(error)
        })
    })

})


// Modify item listings
describe('Modfify item listings', function() {
    let userId = null
    let itemId = null
    
    before(async function(){
        await chai.request(apiAddress)
        .get('/itemListings')
        .then(response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.a('object')
            expect(response.body).to.have.property('postings')
            expect(response.body.postings).to.be.a('array')
            itemId = response.body.postings.id
        })
        
    })
    

    it('Should update item listings successfully',async function(){
        await chai.request(apiAddress)
        .put('/itemlistings/' + 1234)
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
            expect.fail(error)
        })

    })

    it('Should fail if item listings cannot be found',async function(){
        await chai.request(apiAddress)
        .put('/itemlistings/' + 23454345)
        .send({
            title: 'Peruna',
            description: 'Tosi Hieno peruna',
            price: 0.65,
            deliveryType: 'pickup'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            expect.fail(error)
        })
    })

    it('Should delete item listing',async function(){
        await chai.request(apiAddress)
        .delete('/itemlistings/' + 1234)
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
        })
        .catch(error => {
            expect.fail(error)
        })
    })

    it('Should fail if item listings cannot be found',async function(){
        await chai.request(apiAddress)
        .delete('/itemlistings/' + 23454345)
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(404)
        })
        .catch(error => {
            expect.fail(error)
        })
    })



})

