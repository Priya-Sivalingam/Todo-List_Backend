const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/TodoList');

const app = express();
app.use(cors());
app.use(express.json());

// Check for database connection errors
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://AnanthanYonathan:Ananthan123@cluster0.vehip.mongodb.net/todo-app?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB CONNECTED');
    } catch (error) {
        console.error('MongoDB CONNECTION ERROR:', error);
        process.exit(1);
    }
};

// Connect to the database before starting the server
connectDB().then(() => {
    app.listen(3001, () => {
        console.log('Server running on 3001');
    });
});

// Get saved tasks from the database
app.get('/getTodoList', async (req, res) => {
    try {
        const todoList = await TodoModel.find({});
        res.json(todoList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new task to the database
app.post('/addTodoList', async (req, res) => {
    try {
        const newTodo = new TodoModel({
            task: req.body.task,
            status: req.body.status,
            deadline: req.body.deadline,
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update task fields (including deadline)
app.put('/updateTodoList/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = {
            task: req.body.task,
            status: req.body.status,
            deadline: req.body.deadline,
        };
        const updatedTodo = await TodoModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete task from the database
app.delete('/deleteTodoList/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(deletedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
