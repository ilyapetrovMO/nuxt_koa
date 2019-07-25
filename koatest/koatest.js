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
  .get('/data',getData)
  .post('/data',putData)
  .delete('/data',deleteAllDone)
  .put('/data/:id',updateDone)
  .put('/text/:id',updateText);

async function index(ctx){
    ctx.body = 'Hello World';
}

async function getData(ctx){
    ctx.type = 'json';
    ctx.body = todos;
    //router.get('/:controller/:id', (ctx,next) =>{
    //    console.log(ctx.params);
    //});
}

async function putData(ctx){
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

async function deleteAllDone(ctx){
    console.log('start delete');
    todos = todos.filter(todo => todo.done == false);
    ctx.body = todos;
}

async function updateDone(ctx){

    let changeIndex = todos.indexOf(ctx.todoItem);
    console.log(ctx.todoItem);
    console.log('in update');
    ctx.todoItem.done = !ctx.todoItem.done;
    console.log(ctx.todoItem);
    todos[changeIndex] = ctx.todoItem;
    //console.log(todos.indexOf(ctx.todoItem.id));

    ctx.body = ('ok');
    //if(todos)
}

async function updateText(ctx){

    let changeIndex = todos.indexOf(ctx.todoItem);
    console.log(ctx.todoItem);
    let sas = ctx.request.body.text;
    console.log(sas);
    ctx.todoItem.text = ctx.request.body.text;
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