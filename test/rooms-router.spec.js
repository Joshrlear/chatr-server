  
const knex = require('knex')
const request = require('supertest');


describe('getting chatroom from roomQuery', () => {

    before('make knex instance', () => {
      const { DB_URL } = require('../src/config')
      const db = knex({
        client: 'pg',
        connection: DB_URL,
      })    
  
      app.set('db', db)
    })
  
    it('successfully gets room', (done) => {
      return request(app)
        .get(`rooms/1`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });
  });