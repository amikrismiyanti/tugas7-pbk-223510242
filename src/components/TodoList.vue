<template>
    <div class="todo-list">
      <h1>Ami's Todo List</h1>
      <div class="input-group">
        <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a new task" />
        <button @click="addTodo">Add</button>
      </div>
      <div v-if="todos.length === 0" class="no-tasks">No tasks available</div>
      <ul>
        <transition-group name="list" tag="ul">
          <li v-for="(todo, index) in sortedTodos" :key="index" :class="{ completed: todo.completed }">
            <div class="todo-item">
              <span @click="toggleTodoStatus(index)" :class="{ completed: todo.completed }">{{ todo.text }}</span>
              <input v-if="editingIndex === index" v-model="editedText" @blur="saveEdit(index)" @keyup.enter="saveEdit(index)" />
              <div class="buttons">
                <button class="edit-btn" @click="startEdit(index, todo.text)" v-if="editingIndex !== index">Edit</button>
                <button class="delete-btn" @click="removeTodo(index)">Delete</button>
              </div>
            </div>
          </li>
        </transition-group>
      </ul>
      <p>Total incomplete tasks: {{ incompleteTodos }}</p>
      <div class="sort-options">
        <label for="sort">Sort by: </label>
        <select id="sort" v-model="sortOption">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useTodoStore } from '../stores/todoStore';
  
  export default {
    setup() {
      const newTodo = ref('');
      const editedText = ref('');
      const editingIndex = ref(null);
      const sortOption = ref('all');
      const todoStore = useTodoStore();
      
      const addTodo = () => {
        if (newTodo.value.trim() !== '') {
          todoStore.addTodo(newTodo.value);
          newTodo.value = '';
        }
      };
      
      const removeTodo = (index) => {
        todoStore.removeTodo(index);
      };
      
      const toggleTodoStatus = (index) => {
        todoStore.toggleTodoStatus(index);
      };
  
      const startEdit = (index, currentText) => {
        editingIndex.value = index;
        editedText.value = currentText;
      };
  
      const saveEdit = (index) => {
        if (editedText.value.trim() !== '') {
          todoStore.editTodoText(index, editedText.value);
          editingIndex.value = null;
          editedText.value = '';
        }
      };
      
      const sortedTodos = computed(() => {
        if (sortOption.value === 'completed') {
          return todoStore.todos.filter(todo => todo.completed);
        } else if (sortOption.value === 'incomplete') {
          return todoStore.todos.filter(todo => !todo.completed);
        } else {
          return todoStore.todos;
        }
      });
  
      const incompleteTodos = computed(() => {
        return todoStore.incompleteTodos;
      });
  
      return {
        newTodo,
        editedText,
        editingIndex,
        sortOption,
        todos: todoStore.todos,
        addTodo,
        removeTodo,
        toggleTodoStatus,
        startEdit,
        saveEdit,
        sortedTodos,
        incompleteTodos,
      };
    },
  };
  </script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  .todo-list {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border-radius: 8px;
    background: linear-gradient(to right, #667eea, #764ba2);
    color: #fff;
    font-family: 'Roboto', sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: 700;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    color: #fff; /* Warna teks diubah menjadi putih */
  }

  .input-group {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  input[type="text"] {
    width: calc(100% - 120px);
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px 0 0 4px;
    outline: none;
    transition: border-color 0.3s;
  }

  input[type="text"]:focus {
    border-color: #fff;
  }

  button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: background-color 0.3s, transform 0.2s;
    outline: none;
  }

  button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 15px;
    border-bottom: 1px solid #ced4da;
    transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: linear-gradient(to right, #fff, #f8f9fa);
  }

  li:hover {
    background: linear-gradient(to right, #f8f9fa, #ced4da);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  li.completed {
    background: linear-gradient(to right, #e9f9e9, #c8e6c9);
  }

  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .todo-item span {
    flex: 1;
    cursor: pointer;
    word-wrap: break-word;
    color: #333; /* Warna teks diubah menjadi abu-abu gelap */
  }

  .todo-item span.completed {
    text-decoration: line-through;
    color: #888;
  }

  .buttons {
    display: flex;
    gap: 5px;
  }

  .edit-btn, .delete-btn {
    padding: 5px 10px;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
    outline: none;
  }

  .edit-btn:hover {
    background-color: #ffc107;
  }

  .delete-btn:hover {
    background-color: #dc3545;
  }

  .sort-options {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .sort-options label {
    margin-right: 10px;
  }

  .sort-options select {
    padding: 5px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    outline: none;
  }

  .feedback {
    text-align: center;
    color: #28a745;
    margin-top: 20px;
    font-weight: bold;
  }

  .list-enter-active, .list-leave-active {
    transition: all 0.3s ease-out;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
