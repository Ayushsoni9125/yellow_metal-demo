import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

const ACCESS_CODE = 'gold@123'
export const PORTAL_AUTH_KEY = 'gc_portal_auth'

interface PortalGateProps {
  onUnlock: () => void
}

export default function PortalGate({ onUnlock }: PortalGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ACCESS_CODE) {
      sessionStorage.setItem(PORTAL_AUTH_KEY, '1')
      onUnlock()
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
            style={{ width: 48, height: 48, fontSize: 24, borderRadius: 12 }}
            aria-hidden="true"
          >
            G
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="label-caps" style={{ marginBottom: 'var(--space-2)', color: 'var(--color-gold)' }}>
              GoldCredit Portal
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--weight-medium)',
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
              }}
            >
              Enter Access Code
            </h1>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)',
                lineHeight: 'var(--leading-normal)',
              }}
            >
              Gold Loan Application & Partner Intake Portal
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="field">
            <label className="field-label" htmlFor="portal-access-code">
              Access Code
            </label>
            <input
              id="portal-access-code"
              type="password"
              className={`input${error ? ' is-error' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
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
            id="btn-portal-enter"
            style={{ marginTop: 'var(--space-2)' }}
          >
            Enter Portal
          </button>
        </form>

        {/* Demo hint for reviewers */}
        <div
          style={{
            borderTop: '1px dashed var(--color-border)',
            paddingTop: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Demo Access
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px var(--space-4)',
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Access code</span>
            <code
              style={{
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--color-gold-hover)',
                letterSpacing: '0.05em',
                background: 'var(--color-gold-light)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-gold-border)',
              }}
            >
              gold@123
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
