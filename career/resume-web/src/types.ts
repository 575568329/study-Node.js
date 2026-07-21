export type ResumeVersionKey = 'nodeFullstack'

export interface ResumeProfile {
  name: string
  title: string
  location: string
  phone: string
  email: string
  github?: string
  summary: string
  tags: string[]
}

export interface ResumeSection {
  title: string
  items: string[]
  /** 第二行：这组技能能做到什么程度（程度 / 成果描述），可选 */
  level?: string
}

export interface WorkExperience {
  company: string
  role: string
  period: string
  description: string
  bullets: string[]
}

export interface ProjectExperience {
  name: string
  role?: string
  period?: string
  url?: string
  stack: string[]
  description: string
  bullets: string[]
}

export interface ResumeData {
  key: ResumeVersionKey
  label: string
  profile: ResumeProfile
  skillGroups: ResumeSection[]
  workExperiences: WorkExperience[]
  projects: ProjectExperience[]
  education: string[]
}
