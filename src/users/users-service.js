const userServices = {

    //create new user
    createUser(knex, username) {
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
        return knex
            .select('*')
            .from('users')
            .where({ username })
    },
}

module.exports = userServices;