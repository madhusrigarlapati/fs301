/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array of overdue items accordingly.
    // FILL YOUR CODE HERE
    // ..
    // ..
    // ..
    var z = new Date();
    z.setDate(z.getDate() - 1);
    const a = z.toLocaleDateString("en-CA");
    // const a=formattedDate(new Date(new Date().setDate(dateToday.getDate() - 1)));
    let b = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate == a) {
        //console.log(all[i]);
        b.push(all[i]);
      }
    }
    return b;
  };

  const dueToday = () => {
    // Write the date check condition here and return the array of todo items that are due today accordingly.
    // FILL YOUR CODE HERE
    // ..
    // ..
    // ..
    const a = new Date().toLocaleDateString("en-CA");
    let b = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate == a) {
        //console.log(all[i]);
        b.push(all[i]);
      }
    }
    return b;
  };

  const dueLater = () => {
    // Write the date check condition here and return the array of todo items that are due later accordingly.
    // FILL YOUR CODE HERE
    // ..
    // ..
    // ..
    var z = new Date();
    z.setDate(z.getDate() + 1);
    var a = z.toLocaleDateString("en-CA");
    let b = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate == a) {
        //console.log(all[i]);
        b.push(all[i]);
      }
    }
    return b;
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string as per the format given above.
    // FILL YOUR CODE HERE
    // ..
    // ..
    // ..
    // return OUTPUT_STRING
    let s = "";
    for (let i = 0; i < list.length; i++) {
      if (list[i].completed == true) {
        s = s + "[" + "x] ";
      } else {
        s = s + "[ " + "] ";
      }
      const a = formattedDate(dateToday);
      const b = formattedDate(
        new Date(new Date().setDate(dateToday.getDate() + 1))
      );
      if (list[i].dueDate == a) {
        s = s + list[i].title + " " + "\n";
      } else {
        if (i == list.length - 1 && b == list[i].dueDate) {
          s = s + list[i].title + ". " + list[i].dueDate + "\n";
        } else {
          s = s + list[i].title + " " + list[i].dueDate + "\n";
        }
      }
    }
    return s;
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

module.exports = todoList;
