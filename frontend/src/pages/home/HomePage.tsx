import { Link } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell'
import {
  ShieldCheck,
  Zap,
  Percent,
  Coins,
  ArrowRight,
  Calculator,
  FileCheck2,
  Lock,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

export default function HomePage() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section style={{ padding: 'var(--space-12) 0 var(--space-8)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'var(--color-gold-light)',
              border: '1px solid var(--color-gold-border)',
              padding: '6px 14px',
              borderRadius: '999px',
              marginBottom: 'var(--space-6)',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-gold-hover)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              RBI Regulated 75% LTV · Instant Valuation
            </span>
          </div>

          {/* Hero Heading */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-5)',
            }}
          >
            Instant Liquidity Against Your <span style={{ color: 'var(--color-gold)' }}>Gold Assets</span>
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto var(--space-8)',
            }}
          >
            GoldCredit is an intake & preliminary evaluation portal for borrowers and lending partners.
            Pledge your gold ornaments with maximum regulatory compliance, zero hidden fees, and transparent scheme terms.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-12)',
            }}
          >
            <Link
              to="/apply"
              id="hero-cta-apply"
              className="btn btn-primary btn-lg"
              style={{ gap: 'var(--space-2)', padding: '0.875rem 2rem', fontSize: 'var(--text-base)' }}
            >
              Start Loan Application
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/admin"
              id="hero-cta-admin"
              className="btn btn-secondary btn-lg"
              style={{ gap: 'var(--space-2)', padding: '0.875rem 1.75rem', fontSize: 'var(--text-base)' }}
            >
              <Lock size={16} />
              Partner Dashboard
            </Link>
          </div>

          {/* Live Market Reference Banner */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4) var(--space-6)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-6)',
              boxShadow: 'var(--shadow-xs)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Benchmark Gold Rate
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginRight: 6 }}>24K 99.9%</span>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>₹7,000 / g</strong>
              </div>
              <div style={{ width: 1, height: 16, background: 'var(--color-border)', alignSelf: 'center' }} />
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginRight: 6 }}>22K 91.7%</span>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>₹6,417 / g</strong>
              </div>
              <div style={{ width: 1, height: 16, background: 'var(--color-border)', alignSelf: 'center' }} />
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginRight: 6 }}>18K 75.0%</span>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>₹5,250 / g</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: 'var(--space-12) 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <p className="label-caps" style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }}>
              Simple 3-Step Process
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              How This Portal Works
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
              Designed for borrowers seeking immediate preliminary offers and operational partners logging customer leads.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {/* Step 1 Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-gold-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-hover)',
                }}
              >
                <Coins size={20} />
              </div>
              <span className="label-caps" style={{ color: 'var(--color-text-tertiary)' }}>Step 01</span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Enter Gold Collateral Metrics
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Provide applicant contact info alongside Gross & Net weights (in grams) and gold purity (18K, 22K, or 24K).
              </p>
            </div>

            {/* Step 2 Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold)',
                }}
              >
                <Calculator size={20} />
              </div>
              <span className="label-caps" style={{ color: 'var(--color-text-tertiary)' }}>Step 02</span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Real-Time Loan Valuation & Plans
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Our dynamic calculator figures pure gold content and maximum eligible credit at 75% LTV cap. Choose Bullet or Monthly EMI plans.
              </p>
            </div>

            {/* Step 3 Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(34, 160, 107, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-success)',
                }}
              >
                <FileCheck2 size={20} />
              </div>
              <span className="label-caps" style={{ color: 'var(--color-text-tertiary)' }}>Step 03</span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Deduplication & Offer Confirmation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Submit lead with automatic 7-day deduplication verification. Receive a unique Application ID and instant offer summary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section style={{ padding: 'var(--space-12) 0', background: 'var(--color-surface-2)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              Why GoldCredit?
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            {[
              {
                icon: <Percent size={20} />,
                title: 'Competitive 12% - 14% p.a.',
                desc: 'Industry-leading interest rates designed for both short-term bullet and EMI tenure options.',
              },
              {
                icon: <ShieldCheck size={20} />,
                title: 'Strict Regulatory Caps',
                desc: 'Capped at 75% LTV to conform strictly to statutory lending safety guidelines.',
              },
              {
                icon: <Zap size={20} />,
                title: 'Rapid Turnaround',
                desc: 'From collateral weighing to verified preliminary disbursement offer in under 2 minutes.',
              },
              {
                icon: <Lock size={20} />,
                title: 'Bank-Grade Security',
                desc: 'Masked applicant identities, deduplication safety, and encrypted internal operations.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-surface)',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>{item.icon}</div>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{item.title}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div
            style={{
              marginTop: 'var(--space-10)',
              textAlign: 'center',
              padding: 'var(--space-8)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-gold-border)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Ready to submit or evaluate an application?
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
              No paperwork required to generate your instant preliminary gold loan offer.
            </p>
            <Link to="/apply" className="btn btn-primary btn-lg">
              Apply Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
