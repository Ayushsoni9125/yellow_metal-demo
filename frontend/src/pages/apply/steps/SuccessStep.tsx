import { CheckCircle, RotateCcw } from 'lucide-react'
import type { SubmitLeadResponse } from '../../../types'
import { formatINR, formatGrams } from '../../../utils/format'

interface SuccessStepProps {
  result: SubmitLeadResponse
  onStartNew: () => void
}

export default function SuccessStep({ result, onStartNew }: SuccessStepProps) {
  const { applicationId, lead } = result

  return (
    <div className="success-wrap fade-up">
      {/* Icon */}
      <div className="success-icon-ring" aria-hidden="true">
        <CheckCircle size={36} strokeWidth={1.5} />
      </div>

      {/* Heading */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'center' }}>
        <p className="label-caps" style={{ color: 'var(--color-success)' }}>Application Submitted</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--weight-medium)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--color-text-primary)',
        }}>
          You're all set, {lead.customerName.split(' ')[0]}.
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: 360 }}>
          Your gold loan application has been received. Our team will contact you shortly.
        </p>
      </div>

      {/* Application ID box */}
      <div className="app-id-box">
        <span className="label-caps" style={{ color: 'var(--color-text-tertiary)' }}>
          Application ID
        </span>
        <span className="app-id-value" aria-label={`Application ID: ${applicationId}`}>
          {applicationId}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          Save this ID for future reference
        </span>
      </div>

      {/* Financial Summary */}
      <div style={{
        width: '100%',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {/* Hero stat — Eligible Loan Amount */}
        <div style={{
          background: 'var(--color-gold-light)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-6)',
          textAlign: 'center',
        }}>
          <p className="label-caps" style={{ marginBottom: 'var(--space-2)' }}>Maximum Eligible Loan</p>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-gold-hover)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}>
            {formatINR(lead.eligibleLoanAmount)}
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            {lead.selectedPlan.name} · {Number(lead.selectedPlan.interestRate)}% p.a.
          </p>
        </div>

        {/* Detail grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
        }}>
          {[
            { label: 'Gold Value', value: formatINR(lead.goldValue) },
            { label: 'Pure Gold', value: formatGrams(lead.pureGoldWeightGrams) },
            { label: 'LTV Applied', value: `${Number(lead.selectedPlan.maxLtv)}%` },
            { label: 'Status', value: (
              <span className="badge badge-success">
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success)',
                  display: 'inline-block',
                }} />
                {lead.status}
              </span>
            )},
          ].map(({ label, value }, idx) => (
            <div
              key={label}
              style={{
                padding: 'var(--space-4) var(--space-5)',
                borderRight: idx % 2 === 0 ? '1px solid var(--color-border)' : 'none',
                borderBottom: idx < 2 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <p className="label-caps" style={{ marginBottom: 'var(--space-1)' }}>{label}</p>
              <p style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="btn btn-secondary"
        onClick={onStartNew}
        id="btn-start-new"
        style={{ gap: 'var(--space-2)' }}
      >
        <RotateCcw size={14} />
        Start Another Application
      </button>
    </div>
  )
}
