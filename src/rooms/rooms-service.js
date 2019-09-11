// keeps track of rooms
const roomServices = {

    //create new room
    createRoom(knex, name) {
        console.log('logging here in rooms-services line 5 name:', name)
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
        console.log('logging here in rooms-services line 17')
        return knex
            .select('*')
            .from('rooms')
            .where(name)
    },

    //find room by id
    getRoomById(knex, id) {
        console.log('logging here in rooms-services line 27', id)
        return knex
            .select('*')
            .from('rooms')
            .where(id)
    },
}

module.exports = roomServices;