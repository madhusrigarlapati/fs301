/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */

// // models/todo.js
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// const { Op } = require('sequelize')
// const db = require('.');
// const todoList = require('../todo');
// const Todo = require('../TodoModel');
// var z = new Date();
// var a = z.toLocaleDateString("en-CA");

// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//      static async addTask(params) {
//       return  await Todo.create(params);
//     }

//     static async showList() {
//       console.log("My Todo list \n");

//       console.log("Overdue");
//       // FILL IN HERE
//       console.log(await this.overdue())
//       console.log("\n");

//       console.log("Due Today");
//       // FILL IN HERE
//       console.log(await this.dueToday());
//       console.log("\n");

//       console.log("Due Later");
//       // FILL IN HERE
//       console.log(await this.dueLater());
//     }

//     static async overdue() {
//       // FILL IN HERE TO RETURN OVERDUE ITEMS
//       try {
//         const todos = await Todo.findAll(
//           {
//           where:{
//             dueDate : {[Op.lt]:a}
//           }
//         }
//         );
//         const todoList = todos.map((todo) => todo.displayableString()).join("\n");
//         return (todoList);
//       } catch (error) {
//         return (error);
//       }
//     }

//     static async dueToday() {
//       // FILL IN HERE TO RETURN ITEMS DUE tODAY
//       try {
//         const todos = await Todo.findAll(
//           {
//           where:{
//             dueDate :  a
//           }
//         }
//         );
//         const todoList = todos.map((todo) => todo.displayableString()).join("\n");
//         return (todoList);
//       } catch (error) {
//         return (error);
//       }
//     }

//     static async dueLater() {
//       // FILL IN HERE TO RETURN ITEMS DUE LATER
//       try {
//         const todos = await Todo.findAll(
//           {
//           where:{
//             dueDate : {[Op.gt]:a}
//           }
//         }
//         );
//         const todoList = todos.map((todo) => todo.displayableString()).join("\n");
//         return (todoList);
//       } catch (error) {
//         return (error);
//       }
//     }

//     static async markAsComplete(id) {
//       // FILL IN HERE TO MARK AN ITEM AS COMPLETE
//       try {
//         const todo = await Todo.update(
//           { completed: true },
//           {
//             where: {
//               id: id,
//             },
//           }
//         );
//       } catch (error) {
//         console.error(error);
//       }
//     }

//     static associate(models) {
//       // define association here
//     }
//     displayableString() {
//       let checkbox = this.completed ? "[x]" : "[ ]";
//       if(this.dueDate==a){
//         return `${this.id}. ${checkbox} ${this.title}`;
//       }
//       else{
//         return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
//       }
//     }
//   }
//   Todo.init({
//     title: DataTypes.STRING,
//     dueDate: DataTypes.DATEONLY,
//     completed: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'Todo',
//   });
//   return Todo;
// };

"use strict";
const { Model } = require("sequelize");
// var z = new Date();
//  var a = z.toLocaleDateString("en-CA");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }
    static getTodos() {
      return this.findAll();
    }
    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }
    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }
    markAsCompleted() {
      // console.log(this);
      return this.update({ completed: true });
    }
    setCompletionStatus() {
      if (this.dataValues.completed == true) {
        return this.update({ completed: false });
      } else {
        return this.update({ completed: true });
      }
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
