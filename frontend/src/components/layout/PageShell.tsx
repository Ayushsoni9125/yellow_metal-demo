import type { ReactNode } from 'react'
import PageHeader from './PageHeader'

interface PageShellProps {
  children: ReactNode
  /** Pass true on admin pages to skip the shared header (admin has its own) */
  hideHeader?: boolean
}

export default function PageShell({ children, hideHeader = false }: PageShellProps) {
  return (
    <div className="page-shell">
      {!hideHeader && <PageHeader />}
      <main className="page-content" id="main-content">
        {children}
      </main>
    </div>
  )
}
