import { useForm } from 'react-hook-form'
import { AlertCircle, ArrowRight } from 'lucide-react'

interface CustomerStepProps {
  defaultValues: { customerName: string; mobileNumber: string }
  onNext: (data: { customerName: string; mobileNumber: string }) => void
}

type FormValues = { customerName: string; mobileNumber: string }

export default function CustomerStep({ defaultValues, onNext }: CustomerStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      {/* Step header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <p className="label-caps" style={{ marginBottom: 'var(--space-2)' }}>Step 01</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-medium)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Customer Information
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
          Enter the applicant's details. The mobile number will be used to uniquely identify this application.
        </p>
      </div>

      <hr className="divider" style={{ marginTop: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Full Name */}
        <div className="field">
          <label className="field-label" htmlFor="customerName">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="customerName"
            className={`input${errors.customerName ? ' is-error' : ''}`}
            type="text"
            placeholder="e.g. Rahul Sharma"
            autoComplete="name"
            {...register('customerName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 100, message: 'Name must not exceed 100 characters' },
              setValueAs: (v: string) => v.trim(),
            })}
          />
          {errors.customerName && (
            <span className="field-error" role="alert">
              <AlertCircle size={12} />
              {errors.customerName.message}
            </span>
          )}
        </div>

        {/* Mobile Number */}
        <div className="field">
          <label className="field-label" htmlFor="mobileNumber">
            Mobile Number <span className="required">*</span>
          </label>
          <input
            id="mobileNumber"
            className={`input${errors.mobileNumber ? ' is-error' : ''}`}
            type="tel"
            placeholder="10-digit number"
            autoComplete="tel"
            maxLength={10}
            inputMode="numeric"
            {...register('mobileNumber', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Enter a valid 10-digit Indian mobile number',
              },
            })}
          />
          {errors.mobileNumber ? (
            <span className="field-error" role="alert">
              <AlertCircle size={12} />
              {errors.mobileNumber.message}
            </span>
          ) : (
            <span className="field-hint">Must start with 6, 7, 8, or 9</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
        <button type="submit" className="btn btn-primary btn-lg" id="btn-customer-next">
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
