const userServices = {

    //create new user
    createUser(knex, username) {
        console.log('logging here in users-services line 5 name:', username)
        return knex
            .insert({ username })
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //find user by username
    getUser(knex, username) {
        console.log('logging here in users-services line 17')
        return knex
            .select('*')
            .from('users')
            .where({ username })
    },
}

module.exports = userServices;