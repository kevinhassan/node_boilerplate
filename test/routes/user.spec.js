/* eslint-disable prefer-destructuring */
const request = require('supertest');
const { expect } = require('chai');

const app = require('../../app.js');
const User = require('../../models/User');

const data = {
    email: 'test@test.fr',
    password: 'passTest',
};

describe('POST /register', () => {
    before(async () => {
        await User.deleteMany({});
    });
    it('should return 201 OK', (done) => {
        request(app)
            .post('/register')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201, done);
    });
    it('should return 409 ERROR', (done) => {
        request(app)
            .post('/register')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(409, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = { email: '', password: data.password, fullName: data.fullName };
        request(app)
            .post('/register')
            .send(wrongData)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});
describe('POST /login', () => {
    it('should return 200 OK', (done) => {
        request(app)
            .post('/login')
            .send({ email: data.email, password: data.password })
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                expect(res.body.token).to.not.be.undefined;
                done();
            });
    });

    it('should return 422 ERROR', (done) => {
        request(app)
            .post('/login')
            .send({ email: '', password: data.password })
            .expect('Content-Type', /json/)
            .expect(422, done);
    });

    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/login')
            .send({ email: 'unknown@test.fr', password: data.password })
            .expect('Content-Type', /json/)
            .expect(403, done);
    });

    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/login')
            .send({ email: data.email, password: 'wrongpassword' })
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
});

describe('POST /forgot', () => {
    it('should return 404 ERROR', (done) => {
        request(app)
            .post('/forgot')
            .send({ email: 'test1@test.fr' })
            .expect(404, done);
    });
});

describe('DELETE /account', () => {
    const newUser = {
        email: 'newUser@test.fr',
        password: 'passTest',
    };
    let token = null;

    before((done) => {
        request(app)
            .post('/register')
            .send(newUser)
            .end(() => {
                request(app)
                    .post('/login')
                    .send({ email: newUser.email, password: newUser.password })
                    .end((err, res) => {
                        token = res.body.token;
                        done();
                    });
            });
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .delete('/account')
            .expect(401, done);
    });
    it('should return 204 OK', (done) => {
        request(app)
            .delete('/account')
            .set('Authorization', `Bearer ${token}`)
            .expect(204, done);
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .delete('/account')
            .set('Authorization', `Bearer ${token}`)
            .expect(401, done);
    });
});
