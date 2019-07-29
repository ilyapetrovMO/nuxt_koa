const Router = require('koa-router');
const Sequelize = require('sequelize');
const cors = require('@koa/cors');
const Koa = require('koa');
let bodyParser = require('koa-bodyparser');

const sequelize = new Sequelize(
  'postgres://postgres:123@localhost:5432/todoDb',
  { define: { raw: true } });
const app = new Koa();
var router = new Router();

app.use(cors());
app.use(bodyParser());

const Model = Sequelize.Model;
class Todo extends Model{}
Todo.init({
    // id: {
    //     type: Sequelize.NUMBER,
    //     allowNull: false,
    // },
    text: {
        type: Sequelize.STRING,
    },
    done: {
        type: Sequelize.BOOLEAN,
    }
},{
   sequelize,
   modelName: 'todo',
  }
);

sequelize.sync();

sequelize
  .authenticate()
  .then(() => {
      console.log('Connection has been established successfully.');
  })
  .catch(err => {
      console.error('Unable to connect to the database:', err);
  });

// Todo.create({
//     text: "123",
//     done: false,
// });

// var todos = [
//     {id:1, text: "Learn JavaScript", done: false},
//     {id:2, text: "Learn Vue", done: false},
//     {id:3, text: "Play around in JSFiddle", done: true},
//     {id:4, text: "Build something awesome", done: true},
//     {id:5, text: "Build something awesome1", done: true},
// ];
// let lastId =  todos[todos.length-1].id ;

router.param('id',(key, ctx, next) => {
    // let arr = (todos.filter(obj => {return obj.id == key}));
    // ctx.todoId = (arr[0]);
    // return next();

    ctx.todoId = key;
    return next();

    // User.findOne().then(users => {
    //     where: {
    //         id: key,
    //     }
    // })
});

router
  .get('/',index)
  .get('/todos',getTodos)
  .post('/todos',postTodos)
  .delete('/todos/checked',deleteAllChecked)
  .delete('/todos/checked/:id',deleteCheckedById)
  .put('/todos/:id',updateTodo);

async function index(ctx){
    ctx.body = 'Hello World';
}

async function getTodos(ctx){
    ctx.body = await Todo.findAll({raw:true});
}

async function postTodos(ctx){
    // try {
    //     //ctx.type = 'json';
    //     let todo = ctx.request.body;
    //     //console.log('todo', ctx)
    //     todo.id = lastId++;
    //     console.log(todo);
    //     todos.push(todo);
    //     ctx.body = todo;
    // }
    // catch(err) {
    //     console.error(err);
    // }

    let todo = ctx.request.body;
    console.log(todo);

    ctx.body = await Todo.create({
        text: todo.text,
        done: false,
    });
}

async function deleteAllChecked(ctx){
    console.log('start delete');
    // todos = todos.filter(todo => todo.done == false);
    // console.log(todos);
    // ctx.body = todos;

    Todo.destroy({
        where: {
            done: true,
        }
    }).then(() => {
        console.log("done deleting");
    });
    ctx.body = "ok";
}

async function deleteCheckedById(ctx){
    // console.log('in delete by id');
    // let changeIndex = todos.indexOf(ctx.todoItem);
    // todos.splice(changeIndex,1);
    // console.log('deleted entry ' + ctx.todoItem.id);
    // console.log(todos);
    // ctx.body = ('ok');

    await Todo.destroy({
        where: {
            id: ctx.todoId,
        }
    });
    ctx.body = ('ok');
}

async function updateTodo(ctx){
    // let changeIndex = todos.indexOf(ctx.todoItem);
    // console.log(ctx.todoItem);
    // ctx.todoItem = ctx.request.body;
    // console.log(ctx.todoItem);
    // todos[changeIndex] = ctx.todoItem;

    let todo = ctx.request.body;

    await Todo.update({text: todo.text, done: todo.done},{
        where: {
            id: todo.id,
        }
    });
    ctx.body = ('ok');
}

app.use(router.routes());
app.listen(3001);

/*
{
        todos: [
          {text: "Learn JavaScript", done: false},
          {text: "Learn Vue", done: false},
          {text: "Play around in JSFiddle", done: true},
          {text: "Build something awesome", done: true}
        ],
        defText: "",
        editIndex: null,
        previousState: "213",
        ip:"placeholder",
      }
 */