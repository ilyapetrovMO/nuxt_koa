<template>
  <div>
    <h2>Todos:</h2>
    <ol>
      <li v-for="(todo,index) in todos">
        <label>
          <input type="checkbox"
                 v-model="todo.done"
                 v-bind:checked="todo.done"
                 @click="updateDone(todo)">

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
            <button v-if="todo.done == false" :id=index @click="toggleChange(index,todo)">
              change
            </button>
            <button v-else :id=index @click="deleteById(todo.id)">
              delete
            </button>
          </div>
        </label>
      </li>
    </ol>
    <input v-model="defText">
    <button type="button" @click="insertNew()">Create</button>
    <button @click="deleteAll()">
      delete all checked
    </button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        todos: [],
        defText: "",
        editIndex: null,
        previousState: "213",
      };
    },

    methods: {
      toggle: function (todo) {
        todo.done = !todo.done
      },
      async insertNew() {
        await this.$axios.$post('http://localhost:3001/todos', JSON.stringify({
          text: this.defText, done: false
        }), {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        this.refreshData();
      },
      async refreshData() {
        let { data } = await this.$axios.get('http://localhost:3001/todos');
        this.todos = data;
      },
      async deleteById(id) {
        await this.$axios.$delete('http://localhost:3001/todos/checked/'+id);
        this.refreshData();
      },
      async deleteAll() {
        await this.$axios.$delete('http://localhost:3001/todos/checked');
        //this.todos = this.todos.filter(todo => todo.done == false);
        this.refreshData();
      },
      async toggleChange(index,todo) {
        if (index == this.editIndex) {
          console.log(todo.text);
          let myJson = todo;
          await this.$axios.$put('http://localhost:3001/todos/'+todo.id,myJson);
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
      },
      async fetchSomething() {
        let response = await this.$axios.$get('http://localhost:3001/data');
        this.todos = response.data;
      },
      fetchSomething2() {
        this.$axios
          .get('http://localhost:3001/data')
          .then(response => (this.todos = response.data));
      },
      async updateDone(todo) {
        todo.done = !todo.done;
        let myJson = todo;
        await this.$axios.$put('http://localhost:3001/todos/'+todo.id,myJson);
      }
    },
    mounted() {
     this.refreshData();
    },
    async updated() {
      await this.$axios.put
    },
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