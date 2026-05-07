import { useMemo, useState } from 'react'
import { resumes } from './resumeVersions'
import type { ProjectExperience, ResumeData, ResumeVersionKey, WorkExperience } from './types'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section break-inside-avoid pt-2.5">
      <h2 className="resume-section-title mb-1.5 text-[14px] font-bold tracking-wide">{title}</h2>
      {children}
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-[11.6px] leading-[1.48] text-slate-800">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[10px_1fr] gap-1">
          <span className="resume-bullet-dot pt-[7px] text-[7px] leading-none">●</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function WorkBlock({ work }: { work: WorkExperience }) {
  return (
    <article className="break-inside-avoid">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h3 className="text-[13px] font-bold text-slate-950">
          {work.company}｜{work.role}
        </h3>
        <span className="shrink-0 text-[11px] text-slate-500">{work.period}</span>
      </div>
      <p className="mb-1.5 text-[12px] leading-[1.5] text-slate-700">{work.description}</p>
      <BulletList items={work.bullets} />
    </article>
  )
}

function ProjectBlock({ project }: { project: ProjectExperience }) {
  return (
    <article className="project-block break-inside-avoid">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h3 className="project-title text-[13px] font-bold">
          {project.name}
          {project.role ? <span className="font-medium text-slate-600">｜{project.role}</span> : null}
        </h3>
        {project.period ? <span className="shrink-0 text-[11px] text-slate-500">{project.period}</span> : null}
      </div>
      <div className="mb-1.5 flex flex-wrap gap-1">
        {project.stack.map((skill) => (
          <span key={skill} className="skill-pill rounded-sm border px-1.5 py-0.5 text-[10px]">
            {skill}
          </span>
        ))}
      </div>
      <p className="mb-1.5 text-[12px] leading-[1.5] text-slate-700">{project.description}</p>
      <BulletList items={project.bullets} />
    </article>
  )
}

function ResumeSheet({ children }: { children: React.ReactNode }) {
  return (
    <main className="resume-page mx-auto bg-white px-[12mm] py-[10mm] text-slate-900 shadow-sm print:shadow-none">
      {children}
    </main>
  )
}

function ResumeHeader({ data }: { data: ResumeData }) {
  return (
    <header className="resume-header mb-3 pb-2.5">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="resume-name text-[25px] font-black tracking-[0]">{data.profile.name}</h1>
          <p className="mt-1 text-[14px] font-semibold text-slate-800">{data.profile.title}</p>
        </div>
        <div className="shrink-0 text-right text-[11px] leading-[1.6] text-slate-700">
          <div>{data.profile.location}</div>
          <div>{data.profile.phone}</div>
          <div>{data.profile.email}</div>
        </div>
      </div>
      <p className="mt-1.5 text-[11.8px] leading-[1.48] text-slate-700">{data.profile.summary}</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {data.profile.tags.map((tag) => (
          <span key={tag} className="profile-tag rounded-sm px-1.5 py-0.5 text-[10.5px] font-medium">
            {tag}
          </span>
        ))}
      </div>
    </header>
  )
}

function SkillSection({ data }: { data: ResumeData }) {
  return (
    <Section title="职业技能">
      <div className="space-y-1.5">
        {data.skillGroups.map((group) => (
          <div key={group.title} className="skill-card rounded border p-1.5">
            <h3 className="skill-card-title mb-1 text-[11.5px] font-bold">{group.title}</h3>
            <p className="text-[11px] leading-[1.45] text-slate-700">{group.items.join('、')}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function ResumeDocument({ data }: { data: ResumeData }) {
  const hasWork = data.workExperiences.length > 0
  const isFullstackAi = data.key === 'nodeFullstack'

  const workSection = hasWork ? (
    <Section title="工作经历">
      <div className="space-y-2.5">
        {data.workExperiences.map((work) => (
          <WorkBlock key={`${work.company}-${work.period}`} work={work} />
        ))}
      </div>
    </Section>
  ) : null

  const projectSection = (
    <Section title="项目经历">
      <div className="space-y-3">
        {data.projects.map((project) => (
          <ProjectBlock key={project.name} project={project} />
        ))}
      </div>
    </Section>
  )

  return (
    <div className={`resume-theme theme-${data.key}`}>
      <ResumeSheet>
      <ResumeHeader data={data} />

      <div className="space-y-3">
        <SkillSection data={data} />

        {isFullstackAi ? projectSection : workSection}
        {isFullstackAi ? workSection : projectSection}

        <Section title="教育经历">
          <div className="text-[12px] leading-[1.6] text-slate-800">{data.education.join('；')}</div>
        </Section>

      </div>
      </ResumeSheet>
    </div>
  )
}

export function App() {
  const [activeKey, setActiveKey] = useState<ResumeVersionKey>('general')
  const activeResume = useMemo(() => resumes.find((resume) => resume.key === activeKey) ?? resumes[0], [activeKey])
  const handleExportPdf = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-200 py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex w-[210mm] flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <div className="text-sm font-bold text-slate-900">简历版本</div>
          <div className="text-xs text-slate-600">切换版本后用浏览器打印保存 PDF</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {resumes.map((resume) => (
            <button
              key={resume.key}
              type="button"
              onClick={() => setActiveKey(resume.key)}
              className={`rounded border px-3 py-1.5 text-sm ${
                activeKey === resume.key
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
              }`}
            >
              {resume.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleExportPdf}
            className="rounded border border-blue-700 bg-blue-700 px-3 py-1.5 text-sm text-white hover:border-blue-800 hover:bg-blue-800"
          >
            导出 PDF
          </button>
        </div>
      </div>
      <ResumeDocument data={activeResume} />
    </div>
  )
}
