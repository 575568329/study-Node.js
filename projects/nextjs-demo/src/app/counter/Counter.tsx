'use client'

import { useState } from "react"


interface counterPager {
  initialCount: number
}

export default function Counter({initialCount}:counterPager){
  const [count,setcount] = useState(initialCount)
  function reduce(){
    setcount(count-1)
  }
  return (
    <div>
      <div>数字:{count}</div>
      <button onClick={reduce}>-1</button>
    </div>
  )
}