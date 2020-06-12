async function updateProfileSettings (userId, username, email) {
    try {
        return User.findOneAndUpdate({'_id': userId}, {
            $set: {
                'username': username,
                'auth.email': email
            }
        }, {new: true})
    } catch (error) {
        throw new Error(`Unable to update user with id "${userId}".`)
    }
}

async function findUserByEmail (email) {
    try {
        return User.findOne({'auth.email': email.toLowerCase()})
    } catch (error) {
        throw new Error(`Unable to connect to the database.`)
    }
}

async function findUserByUsername (username) {
    try {
        return User.findOne({'username': username})
    } catch (error) {
        throw new Error(`Unable to connect to the database.`)
    }
}

// other methods

export default {
    updateProfileSettings,
    findUserByEmail,
    findUserByUsername,
}