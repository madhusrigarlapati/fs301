/* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
// const { connect } = require("./connectDB.js");
// const Todo = require("./TodoModel.js");
// const createTodo = async () => {
//     try {
//       await connect();
//       //const todo=a;
//       const todo = await Todo.addTask({
//         title: "Second Item",
//         dueDate: new Date(),
//         completed: false,
//       });
//       console.log(`Created todo with ID : ${todo.id}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const countItems = async () => {
//     try {
//       const totalCount = await Todo.count();
//       console.log(`Found ${totalCount} items in the table!`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getAllTodos = async () => {
//     try {
//       const todos = await Todo.findAll(
//       //   {
//       //   where:{
//       //     completed:false
//       //   },
//       //   order:[
//       //     ['id','DESC']
//       //   ]
//       // }
//       );
//       const todoList = todos.map((todo) => todo.displayableString()).join("\n");
//       console.log(todoList);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getSingleTodo = async () => {
//     try {
//       const todo = await Todo.findOne(
//         // {
//         //   where: {
//         //     completed: false,
//         //   },
//         //   order: [["id", "DESC"]],
//         // }
//       );

//       console.log(todo.displayableString());
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const updateItem = async (id) => {
//     try {
//       const todo = await Todo.update(
//         { completed: true },
//         {
//           where: {
//             id: id,
//           },
//         }
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const deleteItem = async (id) => {
//     try {
//       const deletedRowCount = await Todo.destroy({
//         where: {
//           id: id,
//         },
//       });
//       // const deletedRowCount = await Todo.destroy({
//       //   truncate: true
//       // });
//       console.log(`Deleted ${deletedRowCount} rows!`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

// //   (async () => {
// //     //await countItems();
// //     await getAllTodos();
// //     //await updateItem(2);
// //     await deleteItem(2);
// //     await getAllTodos();

// // //    await getSingleTodo();
// //   })();

// const run = async () => {
//   await createTodo();
//   // await countItems();
//   await getAllTodos();
//   // await updateItem(2);
//   //await deleteItem();
//   //await getAllTodos();
// };

// run();
// import todoList from "./todo";
// const Todo = require('./TodoModel');
const app = require("./app");
// const { Op } = require('sequelize')
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
    response.render("index", {
      l: { todos },
      todocom: todoList,
      todonot: todoListnot,
      todotod: todoListtod,
    }); // index refers to index.ejs
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
app.listen(8000, () => {
  console.log("starting the server");
});
