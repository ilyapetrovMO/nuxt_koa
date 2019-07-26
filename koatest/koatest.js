const Router = require('koa-router');
const cors = require('@koa/cors');
//const JSONStream = require('streaming-json-stringify');
const Koa = require('koa');
var bodyParser = require('koa-bodyparser');

const app = new Koa();
var router = new Router();

app.use(cors());
app.use(bodyParser());

var todos = [
    {id:1, text: "Learn JavaScript", done: false},
    {id:2, text: "Learn Vue", done: false},
    {id:3, text: "Play around in JSFiddle", done: true},
    {id:4, text: "Build something awesome", done: true},
    {id:5, text: "Build something awesome1", done: true},
];
let lastId =  todos[todos.length-1].id ;

router.param('id',(key, ctx, next) => {
    let arr = (todos.filter(obj => {return obj.id == key}));
    ctx.todoItem = (arr[0]);
    return next();
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
    ctx.type = 'json';
    ctx.body = todos;
    //router.get('/:controller/:id', (ctx,next) =>{
    //    console.log(ctx.params);
    //});
}

async function postTodos(ctx){
    try {
        //ctx.type = 'json';
        let todo = ctx.request.body;
        //console.log('todo', ctx)
        todo.id = lastId++;
        console.log(todo);
        todos.push(todo);
        ctx.body = todo;
    }
    catch(err) {
        console.error(err);
    }
}

async function deleteAllChecked(ctx){
    console.log('start delete');
    todos = todos.filter(todo => todo.done == false);
    console.log(todos);
    ctx.body = todos;
}

async function deleteCheckedById(ctx){
    console.log('in delete by id');
    let changeIndex = todos.indexOf(ctx.todoItem);
    todos.splice(changeIndex,1);
    console.log('deleted entry ' + ctx.todoItem.id);
    console.log(todos);
    ctx.body = ('ok');

}

async function updateTodo(ctx){

    let changeIndex = todos.indexOf(ctx.todoItem);
    console.log(ctx.todoItem);
    ctx.todoItem = ctx.request.body;
    console.log(ctx.todoItem);
    todos[changeIndex] = ctx.todoItem;
    //console.log(todos.indexOf(ctx.todoItem.id));

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