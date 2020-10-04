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

//Login tests 
describe('Login', function (){
    it('should login successfully', async function() {
        await chai.request(apiAddress)
        .get('/login')
        .send({
            username: 'userName',
            password: 'password'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with incorrect username', async function() {
        await chai.request(apiAddress)
        .get('/login')
        .send({
            username: 'WrongUsername',
            password: 'password'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(401)
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with incorrect password', async function() {
        await chai.request(apiAddress)
        .get('/login')
        .send({
            username: 'username',
            password: 'Wrongpassword'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(401)
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with missing username', async function() {
        await chai.request(apiAddress)
        .get('/login')
        .send({
            
            password: 'password'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(400)
        })
        .catch(error => {
            throw error
        })
    })

    it('should not login with missing password', async function() {
        await chai.request(apiAddress)
        .get('/login')
        .send({
            username: 'username'
        })
        .then(response => {
            expect(response).to.have.property('status')
            expect(response.status).to.equal(400)
        })
        .catch(error => {
            throw error
        })
    })

})
 
//User delete tests
describe('delete user', function() {
    it('should delete user', async function() {
        await chai.request(apiAddress)
            .delete('/users/:id')
            .then(deleteResponse => {
                expect(deleteResponse).to.have.property('status')
                expect(deleteResponse.status).to.equal(200)
                return chai.request(apiAddress)
                    .get('/login')
                    .send({
                        username: 'username',
                        password: 'password'
                    })
            })
            .then(newLoginResponse => {
                expect(newLoginResponse).to.have.property('status')
                expect(newLoginResponse.status).to.equal(400)
            })
            .catch(error => {
                throw error
            }) 
    })
})
    
})
