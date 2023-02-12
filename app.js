/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

const { Todo } = require("./models");

app.get("/todos", (req, res) => {
  //res.send("hello world");
  console.log("Todo list");
  Todo.findAll().then((todos) => {
    return res.json({ todos });
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
    return res.json(todo);
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
