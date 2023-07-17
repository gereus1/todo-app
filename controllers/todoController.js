const bodyParser = require('body-parser');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const database = mongoose.connect('mongodb+srv://user:password@cluster0.utgg6om.mongodb.net/');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const todoSchema = new mongoose.Schema({
    item: String,
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = (app) => {

    app.get('/todo', (req, res) => {
        Todo.find({})
        .then((todos) => {
            // Render the 'todo' view with the fetched todos
            res.render('todo', { todos: todos });
        })
        .catch((err) => {
            console.error('Error fetching todos:', err);
            res.status(500).send('Error fetching todos');
        });
    });

    app.post('/todo', urlencodedParser, (req, res) => {
        const newTodo = new Todo(req.body);
        newTodo.save()
            .then((savedTodo) => {
                res.send("Item saved to database");
            })
            .catch((err) => {
                console.error('Error saving item to database:', err);
                res.status(500).send("Unable to save item to database");
            });
    });

    app.delete('/todo/:item', (req, res) => {
        Todo.deleteOne({ item: req.params.item })
        .then(() => {
            res.json({ message: "Item deleted from database" });
        })
        .catch((err) => {
            console.error('Error deleting item from database:', err);
            res.status(500).send("Unable to delete item from database");
        });    
        // data = data.filter((todo) => todo.item.replace( / /g, '-') !== req.params.item )
        // res.json(data);
    });
}