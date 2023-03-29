const mongoose = require("mongoose")

const UserModelSchema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email: 
        { 
            type: String,
            unique: true,
        },
        password: String
    },
    {
        collection: 'Users'
    })

mongoose.model('User', UserModelSchema)
