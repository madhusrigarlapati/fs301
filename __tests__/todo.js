// // __tests__/todo.js
/* eslint-disable no-undef */
// const db = require("../models");

// describe("Todolist Test Suite", () => {
//   beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//   });

//   test("Should add new todo", async () => {
//     const todoItemsCount = await db.Todo.count();
//     await db.Todo.addTask({
//       title: "Test todo",
//       completed: false,
//       dueDate: new Date(),
//     });
//     const newTodoItemsCount = await db.Todo.count();
//     expect(newTodoItemsCount).toBe(todoItemsCount + 1);
//   });
// });

const req = require("supertest");

const db = require("../models/index");
const app = require("../app");
let server, agent;

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(8000, () => {});
    agent = req.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("responds with json at /todos", async () => {
    const res = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(res.statusCode).toBe(302);
  });

  // test("Mark a todo as complete", async () => {
  //   const res = await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const parsedResponse = JSON.parse(res.text);
  //   const todoID = parsedResponse.id;

  //   expect(parsedResponse.completed).toBe(false);

  //   const markCompleteResponse = await agent
  //     .put(`/todos/${todoID}/markAsCompleted`)
  //     .send();
  //   const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
  //   expect(parsedUpdateResponse.completed).toBe(true);
  // });

  // test("Delete a todo by ID", async () => {
  //   const res = await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   expect(res.statusCode).toBe(200);
  //   const parsedResponse = JSON.parse(res.text);
  //   const todoId = parsedResponse.id;

  //   const todos = await db.Todo.findAll({
  //     where: {
  //       id: todoId,
  //     },
  //   });
  //   expect(todos).toHaveLength(1);

  //   const deleteResponse = await agent.delete(`/todos/${todoId}`).send();
  //   expect(deleteResponse.statusCode).toBe(200);
  //   expect(deleteResponse.body).toBe(true);

  //   const updateTodos = await db.Todo.findAll({
  //     where: {
  //       id: todoId,
  //     },
  //   });
  //   expect(updateTodos).toHaveLength(0);
  // });
});
