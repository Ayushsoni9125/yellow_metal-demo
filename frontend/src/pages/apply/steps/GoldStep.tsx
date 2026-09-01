import { useForm } from 'react-hook-form'
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'

interface GoldStepProps {
  defaultValues: {
    grossWeightGrams: number | ''
    netWeightGrams: number | ''
    purityKarat: 18 | 22 | 24 | ''
  }
  onNext: (data: { grossWeightGrams: number; netWeightGrams: number; purityKarat: 18 | 22 | 24 }) => void
  onBack: () => void
}

type FormValues = {
  grossWeightGrams: string
  netWeightGrams: string
  purityKarat: string
}

const PURITY_OPTIONS = [
  { value: '18', label: '18K', sub: '75.0% pure' },
  { value: '22', label: '22K', sub: '91.7% pure' },
  { value: '24', label: '24K', sub: '99.9% pure' },
]

export default function GoldStep({ defaultValues, onNext, onBack }: GoldStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      grossWeightGrams: defaultValues.grossWeightGrams === '' ? '' : String(defaultValues.grossWeightGrams),
      netWeightGrams: defaultValues.netWeightGrams === '' ? '' : String(defaultValues.netWeightGrams),
      purityKarat: defaultValues.purityKarat === '' ? '' : String(defaultValues.purityKarat),
    },
  })

  const purityValue = watch('purityKarat')
  const grossValue = watch('grossWeightGrams')

  // Register purity as a hidden field for validation
  const { ref: purityHiddenRef, ...purityHiddenRest } = register('purityKarat', {
    required: 'Please select a gold purity',
    validate: (v) => ['18', '22', '24'].includes(v) || 'Please select a gold purity',
  })

  const onSubmit = (data: FormValues) => {
    onNext({
      grossWeightGrams: parseFloat(data.grossWeightGrams),
      netWeightGrams: parseFloat(data.netWeightGrams),
      purityKarat: parseInt(data.purityKarat) as 18 | 22 | 24,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Step header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <p className="label-caps" style={{ marginBottom: 'var(--space-2)' }}>Step 02</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-medium)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Gold Details
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
          Provide the weight and purity of the gold being pledged. All weights should be in grams.
        </p>
      </div>

      <hr className="divider" style={{ marginTop: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Weight row */}
        <div className="grid-2">
          {/* Gross Weight */}
          <div className="field">
            <label className="field-label" htmlFor="grossWeightGrams">
              Gross Weight (g) <span className="required">*</span>
            </label>
            <input
              id="grossWeightGrams"
              className={`input${errors.grossWeightGrams ? ' is-error' : ''}`}
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 50.00"
              inputMode="decimal"
              {...register('grossWeightGrams', {
                required: 'Gross weight is required',
                validate: {
                  positive: (v) => parseFloat(v) > 0 || 'Must be greater than 0',
                },
              })}
            />
            {errors.grossWeightGrams && (
              <span className="field-error" role="alert">
                <AlertCircle size={12} />
                {errors.grossWeightGrams.message}
              </span>
            )}
            <span className="field-hint">Including ornament weight</span>
          </div>

          {/* Net Weight */}
          <div className="field">
            <label className="field-label" htmlFor="netWeightGrams">
              Net Weight (g) <span className="required">*</span>
            </label>
            <input
              id="netWeightGrams"
              className={`input${errors.netWeightGrams ? ' is-error' : ''}`}
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 45.00"
              inputMode="decimal"
              {...register('netWeightGrams', {
                required: 'Net weight is required',
                validate: {
                  positive: (v) => parseFloat(v) > 0 || 'Must be greater than 0',
                  lteGross: (v) =>
                    !grossValue ||
                    parseFloat(v) <= parseFloat(grossValue) ||
                    'Cannot exceed gross weight',
                },
              })}
            />
            {errors.netWeightGrams && (
              <span className="field-error" role="alert">
                <AlertCircle size={12} />
                {errors.netWeightGrams.message}
              </span>
            )}
            <span className="field-hint">Gold weight after deduction</span>
          </div>
        </div>

        {/* Purity */}
        <div className="field">
          <span className="field-label">
            Gold Purity <span className="required">*</span>
          </span>

          {/* Hidden input registered with RHF for validation */}
          <input
            type="hidden"
            {...purityHiddenRest}
            ref={purityHiddenRef}
          />

          <div className="purity-group">
            {PURITY_OPTIONS.map(({ value, label, sub }) => (
              <div key={value} className="purity-option">
                <input
                  type="radio"
                  id={`purity-${value}`}
                  name="purity-visual"
                  checked={purityValue === value}
                  onChange={() =>
                    setValue('purityKarat', value, { shouldValidate: true })
                  }
                />
                <label htmlFor={`purity-${value}`}>
                  {label}
                  <span className="sub">{sub}</span>
                </label>
              </div>
            ))}
          </div>

          {errors.purityKarat && (
            <span className="field-error" role="alert">
              <AlertCircle size={12} />
              {errors.purityKarat.message}
            </span>
          )}
        </div>
      </div>

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
          id="btn-gold-back"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <button type="submit" className="btn btn-primary btn-lg" id="btn-gold-next">
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
