/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 12:26:23
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:03:54
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\stores\useCounterStore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Setup Store 风格 — 和 Composable 写法几乎一样
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)

  // getters
  const doubleCount = computed(() => count.value * 2)

  // actions（同步异步都写这里）
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => { count.value = 0 }

  const fetchRandomCount = async () => {
    const ref = await fetch('https://api.github.com/zen')
    const text = await ref.text()
    count.value = text.length
  }

  return { count, doubleCount, increment, decrement, reset, fetchRandomCount }
})