/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 11:18:52
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 11:20:11
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\composables\useCounter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {ref,computed} from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)

  const increment = () => count.value++
  const decrement = () => count.value--

  return { count, doubleCount, increment, decrement }
}