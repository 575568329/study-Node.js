import {Task} from '../types/task'
import {User} from '../types/user'
import {TagType} from '../types/tag'

//内存数据
let users: User[] = [
  {id: 1, username: 'admin', nickname:'管理员',created_at:'2026-04-08'}
]
let tasks: Task[] = [
    {
      "id": 2,
      "title": "学习 TanStack Query",
      "content": "掌握 useQuery 和 useMutation",
      "status": "in_progress",
      "priority": "high",
      "tag_id": 1,
      "deadline": "2026-04-07",
      "user_id": 1,
      "created_at": "2026-04-02",
      "updated_at": "2026-04-04"
    },
    {
      "id": 3,
      "title": "学习 Zustand",
      "content": "轻量状态管理",
      "status": "done",
      "priority": "medium",
      "tag_id": 2,
      "deadline": "2026-04-04",
      "user_id": 1,
      "created_at": "2026-04-03",
      "updated_at": "2026-04-03"
    },
    {
      "id": 4,
      "title": "学习 Tailwind CSS",
      "content": "工具类样式框架",
      "status": "todo",
      "priority": "low",
      "tag_id": 2,
      "deadline": "2026-04-08",
      "user_id": 1,
      "created_at": "2026-04-04",
      "updated_at": "2026-04-04"
    },
    {
      "id": 5,
      "title": "实战项目开发",
      "content": "完成用户管理系统",
      "status": "in_progress",
      "priority": "high",
      "tag_id": 3,
      "deadline": "2026-04-10",
      "user_id": 1,
      "created_at": "2026-04-05",
      "updated_at": "2026-04-05"
    },
    {
      "title": "111",
      "content": "测试",
      "status": "todo",
      "priority": "medium",
      "tag_id": 2,
      "deadline": "2026-04-06",
      "user_id": 1,
      "created_at": "2026-04-06",
      "updated_at": "2026-04-06",
      "id": 6
    }
  ]

let tags: TagType[] = [
    {
      "id": 1,
      "name": "React",
      "color": "#3b82f6",
      "user_id": 1
    },
    {
      "id": 2,
      "name": "工具",
      "color": "#10b981",
      "user_id": 1
    },
    {
      "id": 3,
      "name": "项目",
      "color": "#f59e0b",
      "user_id": 1
    },
    {
      "id": 4,
      "name": "AI",
      "color": "#ef4444",
      "user_id": 1
    }
  ]
//自增ID
let nextUserId = 2
let nextTaskId = 7
let nextTagId = 4

//导出CRUD函数
export const db = {
  //users
  findUserByUsername: (username: string) => users.find(u => u.username === username),
  createUser: (data: Omit<User, 'id' | 'created_at'> & {password: string}) => {
    const id = nextUserId
    const newUser = {...data,id:id,created_at: String(new Date())}
    users.push(newUser)
    nextUserId++
    return newUser
  },
  getAllTasks: () => tasks,
  getTaskById: (id: number) => tasks.find(t => t.id === id),
  createTask: (data: Omit<Task,'id'|'created_at'|'updated_at'>)=>{
    const id = nextTaskId
    const newTask = {...data,id:id,created_at: String(new Date()),updated_at: String(new Date()) }
    tasks.push(newTask)
    nextTaskId++
    return newTask
  },
  updateTask: (id: number, data: Partial<Task>) => {
    tasks = tasks.map((item)=>{
      if (item.id === id) {
        data.updated_at = String(new Date())
        item = {...item,...data}
      }
      return item
    })
  },
  deleteTask: (id: number) => {
    tasks = tasks.filter((item)=>{
      return item.id !== id
    })
  },
  // tags
  getAllTags: () => tags,
  getTagById: (id: number) => tags.find(t => t.id === id),
  createTag: (data: Omit<TagType,'id'>)=>{
    const id = nextTagId
    tags.push({...data,id:id})
    nextTagId++
  },
  updateTag: (id: number, data: Partial<TagType>) => {
    tags = tags.map((item)=>{
      if (item.id === id) {
        item = {...item,...data}
      }
      return item
    })
  },
  deleteTag: (id: number) => {
    tags = tags.filter((item)=>{
      return item.id !== id
    })
  }
}