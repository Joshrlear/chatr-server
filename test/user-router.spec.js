  
const knex = require('knex')
const request = require('supertest');
const app = require('../src/app')


describe('user', () => {

    beforeEach('make knex instance', () => {
      const { DB_URL } = require('../src/config')
      const db = knex({
        client: 'pg',
        connection: DB_URL,
      })    
  
      app.set('db', db)
    })

    it('given info finds no user', (done) => {
        return request(app)
            .get('/users/banana')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(204, done())
    })

    it('successfully creates user in db', (done) => {
        return request(app)
          .post(`/users`)
          .send({
              username: "banana"
          })
          .set('Accept', 'application/json')
          .send({
              username: "banana"
          })
          .expect('Content-Type', /json/)
          .expect(200,{
            user_id: 2,
            rooms_id: 5
          }, done())
      });

      it('successfully gets user', (done) => {
        return request(app)
            .get('/users/banana')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200,{
              username: "banana"
            }, done())
    })

  });