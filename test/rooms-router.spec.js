  
const knex = require('knex')
const request = require('supertest');
const app = require('../src/app')


describe('getting chatroom from roomQuery', () => {

    before('make knex instance', () => {
      const { DB_URL } = require('../src/config')
      const db = knex({
        client: 'pg',
        connection: DB_URL,
      })    
  
      app.set('db', db)
    })
  
    it('successfully gets all room', () => {
      return request(app)
        .get(`/rooms`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

    it('successfully gets 1 room', () => {
      return request(app)
        .get(`/rooms/1=id`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          res.id = 1,
          res.name = 'new-room'
        })
        .expect(200, {
          id: 1,
          name: 'new-room'
        })
    });

    it('returns 404 when room not found', () => {
      return request(app)
        .get(`/rooms/0=id`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
    });
  });