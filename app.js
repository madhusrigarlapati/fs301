/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
var cookieParser = require("cookie-parser");
var csrf = require("tiny-csrf");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("ssh!some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

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
app.get("/todo", async (request, response) => {
  db.Todo.findAll().then((todos) => {
    //const todoList = todos.map((todo) => todo.displayableString()).join("\n");
    //console.log( todos );
    var todoList = [];
    var todoListnot = [];
    var todoListtod = [];
    var completee = [];

    todos.map(async (todo) => {
      // console.log(todo.dataValues.completed);
      if (todo.dataValues.completed == true) {
        // console.log(todo.dataValues)
        await completee.push(todo.dataValues);
      } else if (todo.dataValues.dueDate < a) {
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
        completee: completee,
        todocom: todoList,
        todonot: todoListnot,
        todotod: todoListtod,
      }); // index refers to index.ejs
    } else {
      response.json({
        l: { todos },
        completee: completee,
        todocom: todoList,
        todonot: todoListnot,
        todotod: todoListtod,
      });
    }
  });
});

app.get("/", (request, response) => {
  db.Todo.findAll().then((todos) => {
    var todoList = [];
    var todoListnot = [];
    var todoListtod = [];
    var completee = [];

    todos.map(async (todo) => {
      if (todo.dataValues.completed == true) {
        // console.log(todo.dataValues)
        await completee.push(todo.dataValues);
      } else if (todo.dataValues.dueDate < a) {
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
      response.render("todo", {
        completee: completee,
        todocom: todoList,
        todonot: todoListnot,
        todotod: todoListtod,
        csrfToken: request.csrfToken(),
      }); // index refers to index.ejs
    } else {
      response.json({
        completee: completee,
        todocom: todoList,
        todonot: todoListnot,
        todotod: todoListtod,
        csrfToken: request.csrfToken(),
      });
    }
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
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id", async (req, res) => {
  console.log("We have to update a todo with ID:", req.params.id);
  const todo = await Todo.findByPk(req.params.id);
  try {
    // const updatedTodo = await todo.markAsCompleted();
    const updatedTodo = await todo.setCompletionStatus();
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
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
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
