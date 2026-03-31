<!--
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 10:15:27
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:38:32
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
</script>

<template>
  <nav>
    <RouterLink to="/">首页</RouterLink> |
    <RouterLink to="/about">关于</RouterLink> |
    <RouterLink to="/user/42">用户42</RouterLink>|
    <RouterLink to="/users">用户管理</RouterLink>
  </nav>
  <RouterView />
</template>