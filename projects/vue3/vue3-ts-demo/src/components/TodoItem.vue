<script setup lang="ts">
// Props: 接收待办内容和序号
const props = defineProps<{
  text: string
  index: number
}>()

// Emits: 类型安全的事件声明
const emit = defineEmits<{
  remove: [index: number]
}>()
</script>

<template>
  <li>
    <span>{{ index + 1 }}. {{ text }}</span>
    <button @click="emit('remove', index)">删除</button>
  </li>
</template>