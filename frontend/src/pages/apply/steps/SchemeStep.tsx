import { useState } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import type { LoanPlan } from '../../../types'
import { previewLoanCalc } from '../../../utils/preview'
import { formatINR, formatGrams } from '../../../utils/format'

interface SchemeStepProps {
  schemes: LoanPlan[]
  loading: boolean
  error: string | null
  onRetry: () => void
  defaultSelectedPlanId: string
  onNext: (data: { selectedPlanId: string }) => void
  onBack: () => void
  /** Gold details from Step 2 — used for real-time loan estimate */
  goldDetails: {
    netWeightGrams: number | ''
    purityKarat: 18 | 22 | 24 | ''
  }
}

export default function SchemeStep({
  schemes,
  loading,
  error,
  onRetry,
  defaultSelectedPlanId,
  onNext,
  onBack,
  goldDetails,
}: SchemeStepProps) {
  const [selectedId, setSelectedId] = useState(defaultSelectedPlanId)
  const [touched, setTouched] = useState(false)

  // Real-time loan estimate — mirrors backend math
  const preview = previewLoanCalc(goldDetails.netWeightGrams, goldDetails.purityKarat)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!selectedId) return
    onNext({ selectedPlanId: selectedId })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Step header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <p className="label-caps" style={{ marginBottom: 'var(--space-2)' }}>Step 03</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-medium)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Choose Loan Scheme
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
          Select a loan scheme that best suits your repayment preference.
        </p>
      </div>

      <hr className="divider" style={{ marginTop: 0 }} />

      {/* ── Loan Estimate Panel ────────────────────────────────── */}
      {preview && (
        <div style={{
          background: 'var(--color-gold-light)',
          border: '1px solid var(--color-gold-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5) var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}>
          {/* Panel header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)',
          }}>
            <Sparkles size={13} style={{ color: 'var(--color-gold)' }} />
            <span className="label-caps" style={{ color: 'var(--color-gold)' }}>
              Loan Estimate
            </span>
          </div>

          {/* Stats row */}
          <div className="loan-estimate-grid">
            {/* Pure Gold */}
            <div className="stat-block">
              <p className="stat-label">Pure Gold</p>
              <p style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-text-primary)',
                lineHeight: 1,
                marginTop: 'var(--space-1)',
              }}>
                {formatGrams(preview.pureGoldWeightGrams)}
              </p>
            </div>

            {/* Gold Value */}
            <div className="stat-block">
              <p className="stat-label">Gold Value</p>
              <p style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-text-primary)',
                lineHeight: 1,
                marginTop: 'var(--space-1)',
              }}>
                {formatINR(preview.goldValue)}
              </p>
            </div>

            {/* Max Eligible Loan — hero value */}
            <div className="stat-block">
              <p className="stat-label">Max Eligible Loan</p>
              <p style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-gold-hover)',
                lineHeight: 1,
                marginTop: 'var(--space-1)',
              }}>
                {formatINR(preview.eligibleLoanAmount)}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-3)',
            lineHeight: 'var(--leading-normal)',
          }}>
            Indicative estimate at ₹{preview.goldPricePerGram.toLocaleString('en-IN')}/g · 75% LTV cap · Final values confirmed upon submission.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-center" style={{ padding: 'var(--space-16)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="spinner spinner--lg" />
            <span className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
              Loading loan schemes…
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="callout callout--error">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong>Unable to load schemes</strong>
              <p style={{ marginTop: 'var(--space-1)' }}>{error}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRetry}
            style={{ alignSelf: 'flex-start' }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {/* Schemes */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {schemes.map((scheme) => {
            const isSelected = scheme.id === selectedId
            return (
              <label
                key={scheme.id}
                className={`option-card${isSelected ? ' is-selected' : ''}`}
                htmlFor={`scheme-${scheme.id}`}
              >
                <input
                  type="radio"
                  id={`scheme-${scheme.id}`}
                  name="selectedPlanId"
                  value={scheme.id}
                  checked={isSelected}
                  onChange={() => { setSelectedId(scheme.id); setTouched(true) }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                  {/* Left */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      {/* Selection dot */}
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--color-gold)' : 'var(--color-border-strong)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'border-color var(--transition-base)',
                      }}>
                        {isSelected && (
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-gold)',
                          }} />
                        )}
                      </div>
                      <span style={{
                        fontWeight: 'var(--weight-semibold)',
                        fontSize: 'var(--text-base)',
                        color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-primary)',
                      }}>
                        {scheme.name}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      paddingLeft: '26px',
                      lineHeight: 'var(--leading-normal)',
                    }}>
                      {scheme.id.includes('BULLET')
                        ? 'Pay interest monthly. Repay principal at end of tenure.'
                        : 'Fixed monthly instalments covering principal and interest.'}
                    </p>
                  </div>

                  {/* Right — rates */}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    flexShrink: 0,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--weight-semibold)',
                        color: isSelected ? 'var(--color-gold-hover)' : 'var(--color-text-primary)',
                        lineHeight: 1,
                      }}>
                        {Number(scheme.interestRate)}%
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 3 }}>
                        p.a.
                      </div>
                    </div>
                    <div style={{
                      width: 1,
                      height: 32,
                      backgroundColor: 'var(--color-border)',
                      alignSelf: 'center',
                    }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--weight-semibold)',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1,
                      }}>
                        {Number(scheme.maxLtv)}%
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 3 }}>
                        Max LTV
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            )
          })}

          {touched && !selectedId && (
            <span className="field-error" role="alert">
              <AlertCircle size={12} />
              Please select a loan scheme to continue
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--space-8)',
      }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          id="btn-scheme-back"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading || !!error}
          id="btn-scheme-next"
        >
          Review Application
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
