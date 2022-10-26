const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const todoSchema = require('../schemas/todoSchema')
const Todo = new mongoose.model('Todo', todoSchema)

// GET ALL TODOS
router.get('/', async (req, res) => {
    await Todo.find({ status: "active" })
        .select({
        _id: 0,
        __v: 0,
        date: 0
    })
        .limit(2)
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

// GET A TODO BY ID
router.get('/:id', async (req, res) => {
    await Todo.find({ _id: req.params.id }, (err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!"
                })
            } else {
                res.status(200).json({
                    result: data,
                })
            }
    }).clone().catch(function (err) { console.log(err) });
})

// POST A TODO
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body)
    await newTodo.save(err => {
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
router.post('/all', async (req, res) => {
    await Todo.insertMany(req.body, err => {
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
router.delete('/:id', async (req, res) => {
    await Todo.deleteOne({ _id: req.params.id }, (err) => {
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