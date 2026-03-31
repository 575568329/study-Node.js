<!--
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 10:15:27
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:04:48
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\components\HelloWorld.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import TodoItem from './TodoItem.vue'
import { useCounter } from '../composables/useCounter'
import { useTodo } from '../composables/useTodo'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '../stores/useCounterStore'

// 一行搞定，逻辑清晰
// const { increment, decrement } = useCounter()
// const { todo, todoCount, addTodo, removeTodo } = useTodo()

// 从store 结构响应式数据 - 必须用storeToRefs
const counterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)
// 方法不需要 storeToRefs, 直接解构
const { increment, decrement, reset } = counterStore
const {  todo, todoCount, addTodo, removeTodo } = useTodo()
// watch 也留在这里，因为是组件特定的副作用
watch(count, (newVal, oldVal) => {
  console.log(`计数器: ${oldVal} → ${newVal}`)
})

onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <div>
    <h2>计数器</h2>
    <p>当前值: {{ count }}</p>
    <button @click="decrement">-1</button>
    <button @click="increment">+1</button>
    <p>双倍值: {{ doubleCount }}</p>
    <button @click="reset">重置</button>
    <button @click="counterStore.fetchRandomCount()">随机数</button>

    <h2>待办清单</h2>
    <input  ref="inputRef" v-model="todo.text" @keyup.enter="addTodo" placeholder="输入待办..." />
    <button @click="addTodo">添加</button>
    <TodoItem
      v-for="(item, index) in todo.items"
      :key="index"
      :text="item"
      :index="index"
      @remove="removeTodo"
    />
    <p>共 {{ todoCount }} 条待办</p>
  </div>
</template>