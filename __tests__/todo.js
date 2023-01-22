// /* eslint-disable no-undef */
// const todoList = require("../todo");
// const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

// describe("Todolist Test Suite", () => {
//   beforeAll(() => {
//     var d = new Date();
//     d.setDate(d.getDate() - 1);
//     var i = d.toLocaleDateString("en-CA");
//     var d1 = new Date();
//     d1.setDate(d1.getDate() + 1);
//     var j = d1.toLocaleDateString("en-CA");
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: new Date().toLocaleDateString("en-CA"),
//     });
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: i,
//     });
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: j,
//     });
//   });
//   test("Should add new todo", () => {
//     const todoItemsCount = all.length;
//     add({
//       title: "Test todo",
//       completed: false,
//       dueDate: new Date().toLocaleDateString("en-CA"),
//     });
//     expect(all.length).toBe(todoItemsCount + 1);
//   });
//   test("should mark a todo as completed", () => {
//     expect(all[0].completed).toBe(false);
//     markAsComplete(0);
//     expect(all[0].completed).toBe(true);
//   });
//   test("Should return a list of dueToday items", () => {
//     var c = dueToday();
//     expect(all[0].title).toBe(c[0].title);
//     expect(all[0].dueDate).toBe(c[0].dueDate);
//   });
//   test("Should return a list of overdue items", () => {
//     var c = overdue();
//     expect(all[1].title).toBe(c[0].title);
//     expect(all[1].dueDate).toBe(c[0].dueDate);
//   });
//   test("Should return a list of dueLater items", () => {
//     var c = dueLater();
//     expect(all[2].title).toBe(c[0].title);
//     expect(all[2].dueDate).toBe(c[0].dueDate);
//   });
// });

// __tests__/todo.js
/* eslint-disable no-undef */
const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });
});