/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const { Todo } = require("./models");

app.set("view engine", "ejs");

// app.get("/t",async (req,res)=>{
//   const allTodos=await Todo.getTodos();
//   if(req.accepts("html")){
//     res.render('index1',{allTodos});
//   }
//   else{
//     res.json({allTodos})
//   }
// })

const { Op } = require("sequelize");
const db = require("./models/index");

var z = new Date();
var a = z.toLocaleDateString("en-CA");
//app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  db.Todo.findAll().then((todos) => {
    //const todoList = todos.map((todo) => todo.displayableString()).join("\n");
    //console.log( todos );
    var todoList = [];
    var todoListnot = [];
    var todoListtod = [];

    todos.map(async (todo) => {
      if (todo.dataValues.dueDate < a) {
        //console.log(todo.dataValues)
        await todoList.push(todo.dataValues);
      } else if (todo.dataValues.dueDate > a) {
        //console.log(todo.dataValues)
        await todoListnot.push(todo.dataValues);
      } else {
        await todoListtod.push(todo.dataValues);
      }
    });
    //console.log(todoList)
    if (request.accepts("html")) {
      response.render("index", {
        l: { todos },
        todocom: todoList,
        todonot: todoListnot,
        todotod: todoListtod,
      }); // index refers to index.ejs
    } else {
      response.json({
        l: { todos },
        todocom: todoList,
        todonot: todoListnot,
        todotod: todoListtod,
      });
    }
  });
});

app.get("/todo", (request, response) => {
  db.Todo.findAll().then((todos) => {
    var todoList = [];
    var todoListnot = [];
    var todoListtod = [];

    todos.map(async (todo) => {
      if (todo.dataValues.dueDate < a) {
        //console.log(todo.dataValues)
        await todoList.push(todo.dataValues);
      } else if (todo.dataValues.dueDate > a) {
        //console.log(todo.dataValues)
        await todoListnot.push(todo.dataValues);
      } else {
        await todoListtod.push(todo.dataValues);
      }
    });
    //console.log(todoList)
    response.render("todo", {
      todocom: todoList,
      todonot: todoListnot,
      todotod: todoListtod,
    }); // index refers to index.ejs
  });
});

app.get("/todos", (req, res) => {
  //res.send("hello world");
  console.log("Todo list");
  Todo.findAll().then((todos) => {
    return res.json({ todos });
    // return res.redirect("/")
  });
});

app.post("/todos", async (req, res) => {
  console.log("Creating a todo", req.body);
  //Todo
  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
    });
    //return res.json(todo);
    return res.redirect("/todo");
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  console.log("We have to update a todo with ID:", req.params.id);
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", (req, res) => {
  console.log("Delete a todo by ID: ", req.params.id);
  const todoId = req.params.id;
  Todo.destroy({
    where: {
      id: todoId,
    },
  })
    .then((deleted) => {
      if (deleted) {
        return res.json(true);
      } else {
        return res.json(false);
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(422).json(error);
    });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
