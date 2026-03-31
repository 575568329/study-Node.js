<script setup lang="ts">
import { useCounterStore } from '../stores/useCounterStore'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
const { count, doubleCount } = storeToRefs(store)
</script>

<template>
  <div>
    <h1>首页</h1>
    <p>计数器: {{ count }}</p>
    <p>双倍: {{ doubleCount }}</p>
    <button @click="store.increment()">+1</button>
    <button @click="store.reset()">重置</button>
  </div>
</template>