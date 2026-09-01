import { useState, useEffect, useCallback } from 'react'
import PageShell from '../../components/layout/PageShell'
import StepIndicator from '../../components/application/StepIndicator'
import CustomerStep from './steps/CustomerStep'
import GoldStep from './steps/GoldStep'
import SchemeStep from './steps/SchemeStep'
import ReviewStep from './steps/ReviewStep'
import SuccessStep from './steps/SuccessStep'
import { getLoanSchemes, submitLead, ApiError } from '../../api/loanApi'
import type {
  ApplicationFormData,
  ApplicationStep,
  LoanPlan,
  SubmitLeadResponse,
} from '../../types'

const EMPTY_FORM: ApplicationFormData = {
  customerName: '',
  mobileNumber: '',
  grossWeightGrams: '',
  netWeightGrams: '',
  purityKarat: '',
  selectedPlanId: '',
}

export default function ApplyPage() {
  const [step, setStep] = useState<ApplicationStep>(1)
  const [formData, setFormData] = useState<ApplicationFormData>(EMPTY_FORM)

  // Schemes
  const [schemes, setSchemes] = useState<LoanPlan[]>([])
  const [schemesLoading, setSchemesLoading] = useState(true)
  const [schemesError, setSchemesError] = useState<string | null>(null)

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitResult, setSubmitResult] = useState<SubmitLeadResponse | null>(null)

  // Fetch loan schemes once on mount (and on retry)
  const fetchSchemes = useCallback(async () => {
    setSchemesLoading(true)
    setSchemesError(null)
    try {
      const data = await getLoanSchemes()
      setSchemes(data)
    } catch (err) {
      setSchemesError(err instanceof Error ? err.message : 'Failed to load loan schemes')
    } finally {
      setSchemesLoading(false)
    }
  }, [])

  useEffect(() => { fetchSchemes() }, [fetchSchemes])

  // Scroll to top on step change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  const update = (data: Partial<ApplicationFormData>) =>
    setFormData((prev) => ({ ...prev, ...data }))

  // ── Step handlers ──────────────────────────────────────────────

  const handleCustomerNext = (data: { customerName: string; mobileNumber: string }) => {
    update(data)
    setStep(2)
  }

  const handleGoldNext = (data: {
    grossWeightGrams: number
    netWeightGrams: number
    purityKarat: 18 | 22 | 24
  }) => {
    update(data)
    setStep(3)
  }

  const handleSchemeNext = (data: { selectedPlanId: string }) => {
    update(data)
    setStep(4)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitLead({
        customerName: formData.customerName,
        mobileNumber: formData.mobileNumber,
        grossWeightGrams: Number(formData.grossWeightGrams),
        netWeightGrams: Number(formData.netWeightGrams),
        purityKarat: Number(formData.purityKarat),
        selectedPlanId: formData.selectedPlanId,
      })
      setSubmitResult(result)
      setStep(5)
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(EMPTY_FORM)
    setSubmitResult(null)
    setSubmitError(null)
    setStep(1)
  }

  // ── Render ─────────────────────────────────────────────────────

  return (
    <PageShell>
      <div className="container container--sm">
        {/* Step indicator — only for steps 1–4 */}
        {step <= 4 && (
          <StepIndicator currentStep={step as 1 | 2 | 3 | 4} />
        )}

        {/* Card with animated step content */}
        <div className="card fade-up" key={step}>
          <div className="card-body">
            {step === 1 && (
              <CustomerStep
                defaultValues={{
                  customerName: formData.customerName,
                  mobileNumber: formData.mobileNumber,
                }}
                onNext={handleCustomerNext}
              />
            )}

            {step === 2 && (
              <GoldStep
                defaultValues={{
                  grossWeightGrams: formData.grossWeightGrams,
                  netWeightGrams: formData.netWeightGrams,
                  purityKarat: formData.purityKarat,
                }}
                onNext={handleGoldNext}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <SchemeStep
                schemes={schemes}
                loading={schemesLoading}
                error={schemesError}
                onRetry={fetchSchemes}
                defaultSelectedPlanId={formData.selectedPlanId}
                onNext={handleSchemeNext}
                onBack={() => setStep(2)}
                goldDetails={{
                  netWeightGrams: formData.netWeightGrams,
                  purityKarat: formData.purityKarat,
                }}
              />
            )}

            {step === 4 && (
              <ReviewStep
                formData={formData}
                schemes={schemes}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onSubmit={handleSubmit}
                onBack={() => setStep(3)}
                onEditStep={(s) => setStep(s)}
              />
            )}

            {step === 5 && submitResult && (
              <SuccessStep
                result={submitResult}
                onStartNew={handleReset}
              />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
