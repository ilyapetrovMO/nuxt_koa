<template>
  <div>
    <h2>Todos:</h2>
    <ol>
      <li v-for="(todo,index) in todos">
        <label>
          <input type="checkbox"
                 v-model="todo.done"
                 v-bind:checked="todo.done">

          <!-- <input type="checkbox"
            v-on:change="toggle(todo)"
            v-bind:checked="todo.done"> -->

          <div style="display:inline-block">
            <div style="display:inline-block" v-if="index == editIndex">
              <input type="text" v-model="todo.text">
              <button @click="toggleCancel(index)">
                cancel
              </button>
            </div>
            <span v-else :id=index :class="{ resolved: todo.done }">
            {{ todo.text }}
          </span>
            <button v-if="todo.done == false" :id=index @click="toggleChange(index)">
              change
            </button>
          </div>
        </label>
      </li>
    </ol>
    <input v-model="defText">
    <button type="button" @click="insertNew()">Create</button>
    <button @click="deleteAll()">
      delete
    </button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        todos: [
          {text: "Learn JavaScript", done: false},
          {text: "Learn Vue", done: false},
          {text: "Play around in JSFiddle", done: true},
          {text: "Build something awesome", done: true}
        ],
        defText: "",
        editIndex: null,
        previousState: "213",
      };
    },

    methods: {
      toggle: function (todo) {
        todo.done = !todo.done
      },
      insertNew() {
        this.todos.push({text: this.defText, done: false});
      },
      deleteAll() {
        this.todos = this.todos.filter(todo => todo.done == false);
      },
      toggleChange(index) {
        if (index == this.editIndex) {
          this.editIndex = null;
        } else {
          this.previousState = this.todos[index].text;
          this.editIndex = index;
        }
      },
      toggleCancel(index) {
        this.todos[index].text = this.previousState;
        this.editIndex = null;
        this.todos[index].done = true;
      }
    }
  }
</script>

<style>
  body {
    //background: #20262E;
    padding: 20px;
    font-family: Helvetica;
  }

  #app {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    transition: all 0.2s;
  }

  .resolved {
    text-decoration: line-through;
    color: grey;
  }

  li {
    margin: 8px 0;
  }

  h2 {
    font-weight: bold;
    margin-bottom: 15px;
  }

  del {
    color: rgba(0, 0, 0, 0.3);
  }
</style>