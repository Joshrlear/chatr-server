// keeps track of which rooms a user is in
const userRoomsServices = {

    // add user to room
    addUserToRoom(knex, userRoomsInfo) {
        console.log('logging here in userRooms-services')
        return knex
            .insert(userRoomsInfo)
            .into('userrooms')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    // looks for userRooms entry and returns if available
    getUserRoom(knex, userRoomsInfo) {
        console.log('checking if user is in room:', userRoomsInfo)
        return knex
            .select('*')
            .from('userrooms')
            .where(userRoomsInfo)
    },

    // remove userRooms entry
    userLeavesRoom(knex, userRoomsInfo){
        console.log('llllllllllllll userRooms-services, userLeavesRoom:', userRoomsInfo)
        return knex('userrooms')
            .where(userRoomsInfo)
            .del()
    }
}
module.exports = userRoomsServices;