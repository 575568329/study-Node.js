export type ResumeVersionKey =
  | 'general'
  | 'frontend'
  | 'nodeFullstack'

export interface ResumeProfile {
  name: string
  title: string
  location: string
  phone: string
  email: string
  summary: string
  tags: string[]
}

export interface ResumeSection {
  title: string
  items: string[]
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
