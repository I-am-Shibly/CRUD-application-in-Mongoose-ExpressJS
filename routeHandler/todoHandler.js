const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const todoSchema = require('../schemas/todoSchema')
const Todo = new mongoose.model('Todo', todoSchema)

// GET ALL TODOS
router.get('/', (req, res) => {
     Todo.find({ status: "active" })
        .select({
        _id: 0,
        __v: 0,
        date: 0
    })
        .limit(10)
        .exec((err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!"
            })
        } else {
            res.status(200).json({
                result: data,
            })
        }
    })
})

// GET ACTIVE TODOS WITH #ASYNC_AWAIT
router.get('/active-async', async (req, res) => {
    const todo = new Todo()
    const data = await todo.findActive_AsyncAwait()
    res.status(200).json({
        data
    })
})

// GET ACTIVE TODOS WITH #CALLBACK
router.get('/active-callback', (req, res) => {
    const todo = new Todo()
    todo.findActive_Callback((err, data) => {
        res.status(200).json({
            data
        })
    })
})

// GET A TODO BY ID
router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.find({ _id: req.params.id })
        res.status(200).json({
            result: data,
            message: 'success'
        })
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!"
        })
    }
})

// GET TODOS WHICH CONTAIN "JS"
router.get('/js', async (req, res) => {
    const data = await Todo.findByJs()
    res.status(200).json({
        data
    })
})

// GET TODOS BY LANGUAGE
router.get('/language', async (req, res) => {
    const data = await Todo.find().byLanguage("js")
    res.status(200).json({
        data
    })
})

// POST A TODO
router.post('/', (req, res) => {
    const newTodo = new Todo(req.body)
    newTodo.save(err => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!"
            })
        } else {
            res.status(200).json({
                message: "Todo was inserted successfully!"
            })
        }
    })
})

// POST MULTIPLE TODOS
router.post('/all', (req, res) => {
    Todo.insertMany(req.body, err => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!"
            })
        } else {
            res.status(200).json({
                message: "Todos were inserted successfully!"
            })
        }
    })
})

// UPDATE TODO
router.put("/:id", async (req, res) => {
    const result = await Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                status: "active",
            },
        },
        {
            new: true,
            useFindAndModify: false,
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    message: "Todo was updated successfully!",
                });
            }
        }
    ).clone().catch(function (err) { console.log(err) });

    console.log(result);
});

// DELETE TODO
router.delete('/:id', (req, res) => {
    Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!"
            })
        } else {
            res.status(200).json({
                message: 'Deleted!'
            })
        }
    }).clone().catch(function (err) { console.log(err) });
})

module.exports = router