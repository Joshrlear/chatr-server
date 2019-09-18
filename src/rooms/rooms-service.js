// keeps track of rooms
const roomServices = {

    //create new room
    createRoom(knex, name) {
        return knex
            .insert({ name })
            .into('rooms')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //find room by roomName
    getRoomByName(knex, name) {
        return knex
            .select('*')
            .from('rooms')
            .where(name)
    },

    //find room by id
    getRoomById(knex, id) {
        return knex
            .select('*')
            .from('rooms')
            .where(id)
    },

    getAllRooms(knex) {
        return knex
            .select('*')
            .from('rooms')
            .orderBy('id', 'desc')
    }
}

module.exports = roomServices;