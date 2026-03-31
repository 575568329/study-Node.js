<script setup lang="ts">
import { useRoute } from 'vue-router';
// props 接收路由参数，类型安全
defineProps<{
  id: string
}>()
const { id } = useRoute().params;
console.log(id,'1231');

</script>

<template>
  <h1>用户页面</h1>
  <p>用户ID: {{ id }}</p>
</template>