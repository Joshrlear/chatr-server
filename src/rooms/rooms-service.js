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
    getRoom(knex, name) {
        console.log('logging here in rooms-services line 17')
        return knex
            .select('*')
            .from('rooms')
            .where({ name })
    },
}

module.exports = roomServices;