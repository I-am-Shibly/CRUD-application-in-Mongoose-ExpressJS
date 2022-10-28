const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");

// GET ALL THE TODOS
router.get("/", checkLogin, (req, res) => {
    Todo.find({ })
        .populate("user", "name username -_id")
        .select({
            _id: 0,
            __v: 0,
            date: 0,
        })
        .limit(20)
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    result: data,
                    message: "Success",
                });
            }
        });
});

// GET ACTIVE TODOS
router.get("/active", async (req, res) => {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
        data,
    });
});

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

// GET ACTIVE TODOS
router.get("/js", async (req, res) => {
    const data = await Todo.findByJS();
    res.status(200).json({
        data,
    });
});

// GET TODOS BY LANGUAGE
router.get("/language", async (req, res) => {
    const data = await Todo.find().byLanguage("js");
    res.status(200).json({
        data,
    });
});

// GET A TODO by ID
router.get("/:id", async (req, res) => {
    try {
        const data = await Todo.find({ _id: req.params.id });
        res.status(200).json({
            result: data,
            message: "Success",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// POST A TODO
router.post("/", checkLogin, async (req, res) => {
    const newTodo = new Todo({ ...req.body, user: req.userId });
    try {
        const todo = await newTodo.save()

        await User.updateOne({
            _id: req.userId,
        }, {
            $push: {
                todos: todo._id
            }
        })
        res.status(200).json({
            message: "Todo was inserted successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// POST MULTIPLE TODO
router.post("/all", (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Todos were inserted successfully!",
            });
        }
    });
});

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

/// DELETE TODO
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

module.exports = router;