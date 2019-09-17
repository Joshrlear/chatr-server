  
const knex = require('knex')
const request = require('supertest');
const app = require('../src/app')


describe('userRooms', () => {

    beforeEach('make knex instance', () => {
      const { DB_URL } = require('../src/config')
      const db = knex({
        client: 'pg',
        connection: DB_URL,
      })    
  
      app.set('db', db)
    })

    it('successfully gets userRooms entry', (done) => {
        return request(app)
            .get('/userRooms/1/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200,{
              user_id: 1,
              rooms_id: 1
            }, done())
    })

    it('given info finds no userRooms entry', (done) => {
        return request(app)
            .get('/userRooms/0/0')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done())
    })

    it('successfully creates userRooms connection in db', (done) => {
        return request(app)
          .post(`/userRooms`)
          .set('Accept', 'application/json')
          .send({
              user_id: 2,
              rooms_id: 5
          })
          .expect('Content-Type', /json/)
          .expect(200,{
            user_id: 2,
            rooms_id: 5
          }, done())
      });

      it('deletes userRooms entry in db on /userLeavesRoom',  (done) => {
        return request(app)
            .delete(`/userRooms/userLeavesRoom`)
            .set('Accept', 'application/json')
            .send({
                user_id: 2,
                rooms_id: 5
            })
            .expect(204, done())
    })
  });