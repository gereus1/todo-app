const bodyParser = require('body-parser');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const database = mongoose.connect('mongodb+srv://user:password@cluster0.utgg6om.mongodb.net/');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const todoSchema = new mongoose.Schema({
    item: String,
    date: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = (app) => {

    app.get('/todo', (req, res) => {
        Todo.find({})
        .then((todos) => {
            res.render('todo', { todos: todos });
        })
        .catch((err) => {
            console.error('Error fetching todos:', err);
            res.status(500).send('Error fetching todos');
        });
    });

    app.get('/stats', (req, res) => {
    Todo.aggregate([
        {
            $project: {
                yearMonthDayHourMin: {
                    $dateToParts: { "date": "$date" }
                },
            }
        },
        {
            $group: {
                _id: {
                    year: "$yearMonthDayHourMin.year",
                    month: "$yearMonthDayHourMin.month",
                    day: "$yearMonthDayHourMin.day",
                    hour: "$yearMonthDayHourMin.hour",
                    minute: "$yearMonthDayHourMin.minute",
                },
                count: { $sum: 1 },
            }
        }
    ])
        .then((stats) => {
        res.render('stats', { stats });
        })
        .catch((err) => {
        console.error('Error fetching statistics:', err);
        res.status(500).send('Error fetching statistics');
        });
    });
    
      app.post('/todo', urlencodedParser, (req, res) => {
        const newTodo = new Todo({
          item: req.body.item,
        });
    
        newTodo
          .save()
          .then(() => {
            res.send('Item saved to database');
          })
          .catch((err) => {
            console.error('Error saving item to database:', err);
            res.status(500).send('Unable to save item to database');
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
    });
}