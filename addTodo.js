// addTodo.js
var argv = require('minimist')(process.argv.slice(2));
const db = require("./models/index")
//const { connect } = require("./connectDB.js");

const createTodo = async (params) => {
  try {
    await db.Todo.addTask(params);
  } catch (error) {
    console.error(error);
  }
};
// const getAllTodos = async () => {
//     try {
//       const todos = await db.Todo.findAll(
      
//       );
//       const todoList = todos.map((todo) => todo.displayableString()).join("\n");
//       console.log(todoList);
//     } catch (error) {
//       console.error(error);
//     }
//   };
// const deleteItem = async () => {
//   try {
//     // const deletedRowCount = await db.Todo.destroy({
//     //   where: {
//     //     id: id,
//     //   },
//     // });
//     const deletedRowCount = await db.Todo.destroy({
//       truncate: true
//     });
//     console.log(`Deleted ${deletedRowCount} rows!`);
//   } catch (error) {
//     console.error(error);
//   }
// };

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay)
}
(async () => {
  const { title, dueInDays } = argv;
  if (!title || dueInDays === undefined) {
    throw new Error("title and dueInDays are required. \nSample command: node addTodo.js --title=\"Buy milk\" --dueInDays=-2 ")
  }
  await createTodo({ title, dueDate: getJSDate(dueInDays), completed: false })
  //await getAllTodos();
  //await deleteItem();
  await db.Todo.showList();

})();
