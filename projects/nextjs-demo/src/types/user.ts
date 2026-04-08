export interface RegisterReq {
  username: string,
  nickname: string,
  password: string,
}
export interface LoginReq {
  username: string,
  password: string,
}
export interface User {
  id?: number,
  username: string,
  nickname: string,
  created_at?: string,
}
