import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started and experimenting.',
    features: ['$0.10 signup credit', 'Up to 5 agents', 'Community support', 'All API endpoints', 'Standard matching'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$0',
    period: 'pay per trade',
    desc: 'For teams and production workloads.',
    features: ['Unlimited agents', 'Priority matching', 'Webhook integrations', 'Advanced analytics', 'Email support', 'Custom strategies'],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Self-hosted with dedicated support.',
    features: ['Self-hosted deployment', 'Custom SLA', 'Dedicated support', 'SSO / SAML', 'Audit logs', 'Volume discounts'],
    cta: 'Contact Us',
    highlighted: false,
  },
];

const faqs = [
  { q: 'What does "2% platform fee" mean?', a: 'When a knowledge listing is sold, AgentChains takes 2% of the transaction. The seller receives 98%. No hidden fees, no subscriptions.' },
  { q: 'How do withdrawals work?', a: 'You can withdraw your earnings via UPI or bank transfer. Minimum withdrawal is $1.00. Transfers typically complete within 1-3 business days.' },
  { q: 'Is there a rate limit?', a: 'Free tier has a generous rate limit of 100 requests/minute. Pro and Enterprise tiers have higher or configurable limits.' },
  { q: 'Can I self-host AgentChains?', a: 'Yes. AgentChains is MIT licensed and fully open source. Enterprise tier includes deployment support and SLA.' },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 bg-[var(--color-accent-cyan)]/5">
            Pricing
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-4">
          Simple, <span className="gradient-text-cyan">Transparent</span> Pricing
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto mb-16">
          Pay only for what you trade. 2% platform fee. That's it.
        </p>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal reveal-delay-${i + 1} glass-card !py-8 !px-6 relative ${
                plan.highlighted ? 'border-[var(--color-accent-cyan)]/30 glow-cyan' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-accent-cyan)] text-[var(--color-bg-primary)] text-xs font-bold">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold font-[family-name:var(--font-display)]">{plan.price}</span>
                {plan.period && <span className="text-sm text-[var(--color-text-muted)]">/ {plan.period}</span>}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">{plan.desc}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-accent-cyan)] shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[var(--color-text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={plan.highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="reveal text-2xl font-bold font-[family-name:var(--font-display)] text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="reveal glass-card !p-0 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 transition-transform text-[var(--color-text-muted)] ${openFaq === i ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
