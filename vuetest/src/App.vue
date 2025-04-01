<script setup>
import {diagne} from './assets/diCss.js'
import {ref, onMounted } from 'vue'
onMounted(() => {
  diagne.init({
  variables: {
    primary: 'rgba(94,179,122)',
    secondary: 'rgba(80,140,100)',
    back: "black",
    text: "rgb(160,165,160)",
  }
  })
})

const todos = ref([])
const newTodo = ref('')

const addTodo = (newTodo) => {
  todos.value.push({ 
    text: newTodo,
    completed: false,
    id: Date.now()
  })
}
</script>

<template>
  <div di-style="bg:[back] tc:[text] flex items:center flex-d:column h:scr-y py:30px">
    <h1 di-style="py:40px tc:[primary] fs:3rem">Todo list</h1>
    <div di-style="grid cols:3fr">
      <input v-model="newTodo" placeholder="Add a new todo" />
      <button @click="addTodo(newTodo)">Add</button>
    </div>
    <ul>
      <li v-for="todo in todos" :key="todo.id" di-style="flex items:center py:10px border:solid_1px_[primary]">
        <input type="checkbox" v-model="todo.completed" />
        <span>{{ todo.text }}</span>
      </li>
    </ul>
  </div>
</template>


