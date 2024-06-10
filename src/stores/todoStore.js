import { defineStore } from 'pinia';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
  }),
  actions: {
    // Actions here
    addTodo(text) {
      this.todos.push({ text, completed: false });
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    toggleTodoStatus(index) {
      this.todos[index].completed = !this.todos[index].completed;
    },
    editTodoText(index, newText) {
      this.todos[index].text = newText;
    },
  },
  getters: {
    incompleteTodos: (state) => {
      return state.todos.filter(todo => !todo.completed).length;
    },
  },
});
