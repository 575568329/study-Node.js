export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <h2 className="text-lg font-bold mb-4">博客专区</h2>
      {children}
    </div>
  )
}