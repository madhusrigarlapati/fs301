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
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
const { default: expect } = require("expect");
let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = req.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  //signup
  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  //signout
  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  //add todo
  test("responds with json at /todos", async () => {
    const agent = req.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    const r = await agent.get("/todos");
    const csrfToken = extractCsrfToken(r);
    const res = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  //markAsComplete
  test("Mark a todo as complete", async () => {
    let agent = req.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.todotod.length;
    const latestTodo = parsedGroupedResponse.todotod[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        completed: true,
        _csrf: csrfToken,
      });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });
  //delete todo
  test("Delete a Todo", async () => {
    let agent = req.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.todotod.length;
    const latestTodo = parsedGroupedResponse.todotod[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const deleteTodo = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });
    const parsedUpdateResponse = JSON.parse(deleteTodo.text);
    expect(parsedUpdateResponse.success).toBe(true);
  });
});
