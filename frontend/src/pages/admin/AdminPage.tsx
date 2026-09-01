import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, RefreshCw, LogOut, AlertCircle, ArrowUpDown } from 'lucide-react'
import { getLeads, ApiError } from '../../api/loanApi'
import type { LeadRecord } from '../../types'
import { formatINR, formatGrams, formatDate } from '../../utils/format'

// ─── Config ───────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'gold@123'
const SESSION_KEY = 'gc_admin_auth'

// ─── Password Gate ────────────────────────────────────────────────────────────

function AdminGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onAuth()
    } else {
      setError(true)
      setPassword('')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="gate-wrap">
      <div className={`gate-box${shake ? ' gate-shake' : ''}`}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            className="site-logo__mark"
            style={{ width: 44, height: 44, fontSize: 22, borderRadius: 10 }}
            aria-hidden="true"
          >G</div>
          <div style={{ textAlign: 'center' }}>
            <p className="label-caps" style={{ marginBottom: 'var(--space-2)', color: 'var(--color-gold)' }}>
              GoldCredit
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--weight-medium)',
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
            }}>
              Partner Access
            </h1>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--space-2)',
              lineHeight: 'var(--leading-normal)',
            }}>
              Internal lending operations dashboard
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <div className="field">
            <label className="field-label" htmlFor="admin-password">Access Code</label>
            <input
              id="admin-password"
              type="password"
              className={`input${error ? ' is-error' : ''}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              placeholder="Enter access code"
              autoComplete="current-password"
              autoFocus
            />
            {error && (
              <span className="field-error" role="alert">
                <AlertCircle size={12} />
                Incorrect access code. Please try again.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="btn-admin-signin"
            style={{ marginTop: 'var(--space-2)' }}
          >
            Sign In to Dashboard
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          Restricted access — authorised personnel only
        </p>

        {/* Demo hint for reviewers */}
        <div style={{
          borderTop: '1px dashed var(--color-border)',
          paddingTop: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
            Demo Access
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '6px var(--space-4)',
          }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Access code</span>
            <code style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-gold-hover)',
              letterSpacing: '0.05em',
              background: 'var(--color-gold-light)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-gold-border)',
            }}>
              gold@123
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  sub?: string
  gold?: boolean
  large?: boolean
}

function StatCard({ label, value, sub, gold = false, large = false }: StatCardProps) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className={`stat-card__value${gold ? ' stat-card__value--gold' : ''}${large ? ' stat-card__value--lg' : ''}`}>
        {value}
      </p>
      {sub && <p className="stat-card__sub">{sub}</p>}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onSignOut: () => void
}

type SortKey = 'createdAt' | 'eligibleLoanAmount' | 'goldValue'
type SortDir = 'asc' | 'desc'

function AdminDashboard({ onSignOut }: AdminDashboardProps) {
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getLeads()
      setLeads(data.leads)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = leads.length
    const totalLoan = leads.reduce((sum, l) => sum + Number(l.eligibleLoanAmount), 0)
    const totalGold = leads.reduce((sum, l) => sum + Number(l.goldValue), 0)
    const avgLoan = total ? totalLoan / total : 0
    return { total, totalLoan, totalGold, avgLoan }
  }, [leads])

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim()
    let result = q
      ? leads.filter(
          (l) =>
            l.customerName.toLowerCase().includes(q) ||
            l.applicationId.toLowerCase().includes(q) ||
            l.mobileNumber.includes(q),
        )
      : [...leads]

    result.sort((a, b) => {
      let aVal: number, bVal: number
      if (sortKey === 'createdAt') {
        aVal = new Date(a.createdAt).getTime()
        bVal = new Date(b.createdAt).getTime()
      } else {
        aVal = Number(a[sortKey])
        bVal = Number(b[sortKey])
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })

    return result
  }, [leads, search, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => (
    <ArrowUpDown
      size={12}
      style={{
        marginLeft: 4,
        opacity: sortKey === col ? 1 : 0.35,
        color: sortKey === col ? 'var(--color-gold)' : 'inherit',
      }}
    />
  )

  return (
    <div className="admin-shell">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="container admin-header__inner">
          {/* Logo */}
          <Link to="/apply" className="site-logo" aria-label="Back to apply">
            <div className="site-logo__mark" aria-hidden="true">G</div>
            <span className="site-logo__name">
              Gold<span>Credit</span>
              <span style={{
                marginLeft: 8,
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-regular)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: 0,
              }}>
                Partner Dashboard
              </span>
            </span>
          </Link>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={fetchLeads}
              disabled={loading}
              aria-label="Refresh data"
              id="btn-admin-refresh"
              title="Refresh"
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
              <span style={{ display: 'none' }}>Refresh</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onSignOut}
              id="btn-admin-signout"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="admin-content container" id="admin-main">
        {/* Page title */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-1)',
          }}>
            Loan Applications
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            All submitted applications · updated in real time
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard
            label="Total Applications"
            value={String(stats.total)}
            sub="all time"
            large
          />
          <StatCard
            label="Portfolio Value"
            value={formatINR(stats.totalLoan)}
            sub="total eligible loan"
            gold
          />
          <StatCard
            label="Average Loan"
            value={formatINR(stats.avgLoan)}
            sub="per application"
          />
          <StatCard
            label="Gold Value"
            value={formatINR(stats.totalGold)}
            sub="total pledged"
          />
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="callout callout--error" style={{ marginBottom: 'var(--space-6)' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div>
              <strong>Failed to load applications</strong>
              <p style={{ marginTop: 4 }}>{error}</p>
              <button
                className="btn btn-sm btn-secondary"
                onClick={fetchLeads}
                style={{ marginTop: 8 }}
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Table panel */}
        <div className="card">
          {/* Toolbar */}
          <div className="card-body" style={{ paddingBottom: 0, borderBottom: '1px solid var(--color-border)' }}>
            <div className="table-toolbar">
              {/* Search */}
              <div className="search-wrap">
                <Search size={14} className="search-wrap__icon" aria-hidden="true" />
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by name, ID, or mobile…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="admin-search"
                  aria-label="Search applications"
                />
              </div>

              {/* Count */}
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                {loading
                  ? 'Loading…'
                  : `${filteredLeads.length} of ${leads.length} application${leads.length !== 1 ? 's' : ''}`
                }
              </span>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredLeads.length === 0 && (
            <div className="empty-state">
              <Search className="empty-state__icon" aria-hidden="true" />
              <p className="empty-state__title">
                {search ? 'No matching applications' : 'No applications yet'}
              </p>
              <p className="empty-state__sub">
                {search
                  ? `No results for "${search}". Try a different search.`
                  : 'Applications will appear here after customers submit the form.'}
              </p>
              {search && (
                <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* ── Desktop Table ─────────────────────────────────────── */}
          {!loading && filteredLeads.length > 0 && (
            <div className="data-table-wrapper">
              <table className="data-table" aria-label="Loan applications">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Customer</th>
                    <th>Mobile</th>
                    <th>Purity</th>
                    <th>Net Weight</th>
                    <th
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('goldValue')}
                    >
                      Gold Value <SortIcon col="goldValue" />
                    </th>
                    <th
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('eligibleLoanAmount')}
                    >
                      Eligible Loan <SortIcon col="eligibleLoanAmount" />
                    </th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('createdAt')}
                    >
                      Date <SortIcon col="createdAt" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.applicationId}>
                      {/* ID */}
                      <td>
                        <span className="app-id-mono">{lead.applicationId}</span>
                      </td>
                      {/* Customer */}
                      <td style={{ fontWeight: 'var(--weight-medium)' }}>
                        {lead.customerName}
                      </td>
                      {/* Mobile — always masked from backend */}
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>
                        {lead.mobileNumber}
                      </td>
                      {/* Purity */}
                      <td>
                        <span className="badge badge-gold">{lead.purityKarat}K</span>
                      </td>
                      {/* Net Weight */}
                      <td style={{ color: 'var(--color-text-secondary)' }}>
                        {formatGrams(lead.netWeightGrams)}
                      </td>
                      {/* Gold Value */}
                      <td style={{ fontWeight: 'var(--weight-medium)' }}>
                        {formatINR(lead.goldValue)}
                      </td>
                      {/* Eligible Loan — visually prominent */}
                      <td>
                        <span style={{
                          fontWeight: 'var(--weight-semibold)',
                          color: 'var(--color-gold-hover)',
                        }}>
                          {formatINR(lead.eligibleLoanAmount)}
                        </span>
                      </td>
                      {/* Plan */}
                      <td style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--text-sm)',
                        maxWidth: 140,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {lead.selectedPlan.name}
                        <span style={{ color: 'var(--color-text-tertiary)', marginLeft: 4 }}>
                          {Number(lead.selectedPlan.interestRate)}%
                        </span>
                      </td>
                      {/* Status */}
                      <td>
                        <span className="badge badge-success">
                          <span style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-success)',
                            display: 'inline-block',
                          }} />
                          {lead.status}
                        </span>
                      </td>
                      {/* Date */}
                      <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Mobile Cards ──────────────────────────────────────── */}
          {!loading && filteredLeads.length > 0 && (
            <div className="lead-cards" style={{ padding: 'var(--space-4)' }}>
              {filteredLeads.map((lead) => (
                <div key={lead.applicationId} className="lead-card">
                  {/* Header */}
                  <div className="lead-card__header">
                    <div>
                      <p className="lead-card__id">{lead.applicationId}</p>
                      <p className="lead-card__name">{lead.customerName}</p>
                      <p className="lead-card__meta">{lead.mobileNumber}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                      <span className="badge badge-success">
                        <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block' }} />
                        {lead.status}
                      </span>
                      <span className="badge badge-gold">{lead.purityKarat}K</span>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="lead-card__financials">
                    <div>
                      <p className="lead-card__fin-label">Gold Value</p>
                      <p className="lead-card__fin-value">{formatINR(lead.goldValue)}</p>
                    </div>
                    <div>
                      <p className="lead-card__fin-label">Eligible Loan</p>
                      <p className="lead-card__fin-value lead-card__fin-value--gold">
                        {formatINR(lead.eligibleLoanAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="lead-card__fin-label">Net Weight</p>
                      <p className="lead-card__fin-value">{formatGrams(lead.netWeightGrams)}</p>
                    </div>
                    <div>
                      <p className="lead-card__fin-label">Interest</p>
                      <p className="lead-card__fin-value">{Number(lead.selectedPlan.interestRate)}% p.a.</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="lead-card__footer">
                    <span>{lead.selectedPlan.name}</span>
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1',
  )

  const handleSignOut = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <AdminGate onAuth={() => setIsAuthenticated(true)} />
  }

  return <AdminDashboard onSignOut={handleSignOut} />
}
