import { AlertCircle, ArrowLeft, Loader2, Pencil } from 'lucide-react'
import type { ApplicationFormData, LoanPlan } from '../../../types'

interface ReviewStepProps {
  formData: ApplicationFormData
  schemes: LoanPlan[]
  isSubmitting: boolean
  submitError: string | null
  onSubmit: () => void
  onBack: () => void
  onEditStep: (step: 1 | 2 | 3) => void
}

interface ReviewSectionProps {
  title: string
  editStep: 1 | 2 | 3
  onEdit: (step: 1 | 2 | 3) => void
  children: React.ReactNode
}

function ReviewSection({ title, editStep, onEdit, children }: ReviewSectionProps) {
  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-3)',
      }}>
        <span className="label-caps">{title}</span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onEdit(editStep)}
          aria-label={`Edit ${title}`}
          style={{ gap: 'var(--space-1)', color: 'var(--color-gold)', fontSize: 'var(--text-xs)' }}
        >
          <Pencil size={11} />
          Edit
        </button>
      </div>
      <div style={{
        background: 'var(--color-surface-2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-1) var(--space-4)',
        border: '1px solid var(--color-border)',
      }}>
        {children}
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="review-row">
      <span className="review-row__key">{label}</span>
      <span className="review-row__val">{value}</span>
    </div>
  )
}

export default function ReviewStep({
  formData,
  schemes,
  isSubmitting,
  submitError,
  onSubmit,
  onBack,
  onEditStep,
}: ReviewStepProps) {
  const selectedPlan = schemes.find((s) => s.id === formData.selectedPlanId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const purityLabel = formData.purityKarat ? `${formData.purityKarat}K` : '—'
  const grossGrams = formData.grossWeightGrams !== '' ? `${Number(formData.grossWeightGrams).toFixed(2)} g` : '—'
  const netGrams = formData.netWeightGrams !== '' ? `${Number(formData.netWeightGrams).toFixed(2)} g` : '—'

  return (
    <form onSubmit={handleSubmit}>
      {/* Step header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <p className="label-caps" style={{ marginBottom: 'var(--space-2)' }}>Step 04</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-medium)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Review Application
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
          Verify all details before submitting. You can go back to edit any section.
        </p>
      </div>

      <hr className="divider" style={{ marginTop: 0 }} />

      {/* Customer section */}
      <ReviewSection title="Customer" editStep={1} onEdit={onEditStep}>
        <ReviewRow label="Full Name" value={formData.customerName || '—'} />
        <ReviewRow label="Mobile Number" value={formData.mobileNumber || '—'} />
      </ReviewSection>

      {/* Gold section */}
      <ReviewSection title="Gold Details" editStep={2} onEdit={onEditStep}>
        <ReviewRow label="Gross Weight" value={grossGrams} />
        <ReviewRow label="Net Weight" value={netGrams} />
        <ReviewRow label="Purity" value={purityLabel} />
      </ReviewSection>

      {/* Loan scheme section */}
      <ReviewSection title="Loan Scheme" editStep={3} onEdit={onEditStep}>
        <ReviewRow
          label="Plan"
          value={selectedPlan ? selectedPlan.name : '—'}
        />
        <ReviewRow
          label="Interest Rate"
          value={selectedPlan ? `${Number(selectedPlan.interestRate)}% p.a.` : '—'}
        />
        <ReviewRow
          label="Max LTV"
          value={selectedPlan ? `${Number(selectedPlan.maxLtv)}%` : '—'}
        />
      </ReviewSection>

      {/* Note */}
      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-tertiary)',
        lineHeight: 'var(--leading-normal)',
        marginBottom: 'var(--space-6)',
      }}>
        By submitting, you confirm that all provided information is accurate.
        Loan eligibility will be calculated upon submission based on current gold rates.
      </p>

      {/* API error */}
      {submitError && (
        <div className="callout callout--error" style={{ marginBottom: 'var(--space-5)' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Submission failed</strong>
            <p style={{ marginTop: 'var(--space-1)' }}>{submitError}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={isSubmitting}
          id="btn-review-back"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
          id="btn-review-submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
              Submitting…
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  )
}
