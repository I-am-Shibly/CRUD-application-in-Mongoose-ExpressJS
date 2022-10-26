const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    date: {
        type: Date,
        default: Date.now
    }
})

todoSchema.methods = {
    findActive_AsyncAwait: function () {
        return mongoose.model("Todo").find({status: "active"})
    },

    findActive_Callback: function (cb) {
        return mongoose.model("Todo").find({ status: "active" }, cb)
    }
}

module.exports = todoSchema