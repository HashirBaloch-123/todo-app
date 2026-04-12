const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/tododb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Todo Model
const Todo = mongoose.model('Todo', new mongoose.Schema({
    task: String,
    done: { type: Boolean, default: false }
}));

// Simple HTML UI
app.get('/', async (req, res) => {
    const todos = await Todo.find();
    let items = todos.map(t =>
        `<li>${t.task} ${t.done ? '✅' : '❌'}
     <a href="/done/${t._id}">Mark Done</a>
     <a href="/delete/${t._id}">Delete</a></li>`
    ).join('');
    res.send(`
    <h1>My To-Do List</h1>
    <form method="POST" action="/add">
      <input name="task" placeholder="New task" required/>
      <button type="submit">Add</button>
    </form>
    <ul>${items}</ul>
  `);
});

app.post('/add', async (req, res) => {
    await Todo.create({ task: req.body.task });
    res.redirect('/');
});

app.get('/done/:id', async (req, res) => {
    await Todo.findByIdAndUpdate(req.params.id, { done: true });
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => console.log('Server running on port 3000'));
