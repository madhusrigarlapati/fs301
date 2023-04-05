/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
var cookieParser = require("cookie-parser");
var csrf = require("tiny-csrf");
const flash = require("connect-flash");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("ssh!some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hrs
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return error;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

const { Todo, User } = require("./models");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(flash());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
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
// app.get("/todo", async (request, response) => {
//   db.Todo.findAll().then((todos) => {
//     //const todoList = todos.map((todo) => todo.displayableString()).join("\n");
//     //console.log( todos );
//     var todoList = [];
//     var todoListnot = [];
//     var todoListtod = [];
//     var completee = [];

//     todos.map(async (todo) => {
//       // console.log(todo.dataValues.completed);
//       if (todo.dataValues.completed == true) {
//         // console.log(todo.dataValues)
//         await completee.push(todo.dataValues);
//       } else if (todo.dataValues.dueDate < a) {
//         //console.log(todo.dataValues)
//         await todoList.push(todo.dataValues);
//       } else if (todo.dataValues.dueDate > a) {
//         //console.log(todo.dataValues)
//         await todoListnot.push(todo.dataValues);
//       } else {
//         await todoListtod.push(todo.dataValues);
//       }
//     });
//     //console.log(todoList)
//     if (request.accepts("html")) {
//       response.render("index", {
//         l: { todos },
//         completee: completee,
//         todocom: todoList,
//         todonot: todoListnot,
//         todotod: todoListtod,
//       }); // index refers to index.ejs
//     } else {
//       response.json({
//         l: { todos },
//         completee: completee,
//         todocom: todoList,
//         todonot: todoListnot,
//         todotod: todoListtod,
//       });
//     }
//   });
// });

app.get("/", async (req, res) => {
  res.render("todo", {
    title: "Todo application",
    csrfToken: req.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    db.Todo.findAll().then((todos) => {
      var todoList = [];
      var todoListnot = [];
      var todoListtod = [];
      var completee = [];
      var i = request.user.id;
      todos.map(async (todo) => {
        if (todo.dataValues.completed == true && i == todo.dataValues.userId) {
          // console.log(todo.dataValues)
          await completee.push(todo.dataValues);
        } else if (todo.dataValues.dueDate < a && i == todo.dataValues.userId) {
          //console.log(todo.dataValues)
          await todoList.push(todo.dataValues);
        } else if (todo.dataValues.dueDate > a && i == todo.dataValues.userId) {
          //console.log(todo.dataValues)
          await todoListnot.push(todo.dataValues);
        } else if (
          todo.dataValues.dueDate == a &&
          i == todo.dataValues.userId
        ) {
          await todoListtod.push(todo.dataValues);
        }
      });
      //console.log(todoList)
      if (request.accepts("html")) {
        response.render("todos", {
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
  }
);

app.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup", csrfToken: req.csrfToken() });
});

app.post("/users", async (req, res) => {
  // console.log(req.body.lastName);
  if (req.body.firstName.length === 0) {
    req.flash("error", "Please Enter First Name");
    return res.redirect("/signup");
  }
  if (req.body.email.length === 0) {
    req.flash("error", "Please Enter Email");
    return res.redirect("/signup");
  }
  if (req.body.password.length === 0) {
    req.flash("error", "Please Enter Password");
    return res.redirect("/signup");
  }

  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  console.log(hashedPwd);
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastNmae: req.body.lastName,
      email: req.body.email,
      password: hashedPwd,
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login", csrfToken: req.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.body.email.length === 0) {
      req.flash("error", "Error! Please Enter Email");
      return res.redirect("/login");
    }
    if (req.body.password.length === 0) {
      req.flash("error", "Error! Please Enter Password");
      return res.redirect("/login");
    }
    console.log(req.user);
    res.redirect("/todos");
  }
);

app.get("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
// app.get("/todos", (req, res) => {
//   //res.send("hello world");
//   console.log("Todo list");
//   Todo.findAll().then((todos) => {
//     return res.json({ todos });
//     // return res.redirect("/")
//   });
// });

app.post("/todos", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  console.log("Creating a todo", req.body);
  if (req.body.title.length === 0) {
    req.flash("error", "Please Enter title of the todo");
    return res.redirect("/todos");
  } else if (req.body.dueDate.length === 0) {
    req.flash("error", "Please Enter due date");
    return res.redirect("/todos");
  }
  //Todo
  else {
    try {
      const todo = await Todo.addTodo({
        title: req.body.title,
        dueDate: req.body.dueDate,
        userId: req.user.id,
      });
      //return res.json(todo);
      return res.redirect("/todos");
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
});

app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
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

app.delete("/todos/:id", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  console.log("Delete a todo by ID: ", req.params.id);
  const todoId = req.params.id;
  var i = req.user.id;
  Todo.destroy({
    where: {
      id: todoId,
      userId: i,
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
