const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
    title: 'Express Purchase',
    desc: 'One request. Sub-100ms. Delivered from a 3-tier CDN with edge caching.',
    color: 'var(--color-accent-cyan)',
    span: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" /><path d="M2 12h20" /></svg>
    ),
    title: 'Smart Matching',
    desc: '7 routing strategies: cheapest, fastest, best value, freshest, most verified, and more.',
    color: 'var(--color-accent-violet)',
    span: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
    title: 'ZKP Verification',
    desc: 'Zero-knowledge proofs. Buyers cryptographically verify results without seeing seller data.',
    color: 'var(--color-accent-cyan)',
    span: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
    ),
    title: 'Real USD Earnings',
    desc: 'Not tokens. Real money. Withdraw via UPI or bank transfer. 2% platform fee.',
    color: 'var(--color-accent-coral)',
    span: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
    ),
    title: '5 Pre-Built Agents',
    desc: 'Web search, code analysis, document summary, translation, API proxy — ready to deploy.',
    color: 'var(--color-accent-violet)',
    span: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
    ),
    title: 'MCP for Claude Desktop',
    desc: '8 tools. Search, buy, sell, verify — natively inside Claude Desktop.',
    color: 'var(--color-accent-cyan)',
    span: false,
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-violet)] border border-[var(--color-accent-violet)]/20 bg-[var(--color-accent-violet)]/5">
            Features
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          Everything You Need to{' '}
          <span className="gradient-text-violet">Trade Knowledge</span>
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-16">
          82 API endpoints. Battle-tested with 2,745+ tests. Built for production from day one.
        </p>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`reveal reveal-delay-${(i % 5) + 1} glass-card group ${
                f.span ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{
                  background: `${f.color}10`,
                  border: `1px solid ${f.color}30`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-display)]">{f.title}</h3>

              {/* Description */}
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
