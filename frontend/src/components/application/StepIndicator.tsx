import { Check } from 'lucide-react'

const STEPS = [
  { num: 1, label: 'Customer' },
  { num: 2, label: 'Gold Details' },
  { num: 3, label: 'Scheme' },
  { num: 4, label: 'Review' },
]

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Application progress" style={{ marginBottom: 'var(--space-8)' }}>
      <ol className="step-bar">
        {STEPS.map((step) => {
          const isDone = step.num < currentStep
          const isActive = step.num === currentStep
          return (
            <li
              key={step.num}
              className={`step-item${isDone ? ' is-done' : ''}${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="step-circle" aria-hidden="true">
                {isDone
                  ? <Check size={13} strokeWidth={2.5} />
                  : <span>{String(step.num).padStart(2, '0')}</span>
                }
              </div>
              <span className="step-label">{step.label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
