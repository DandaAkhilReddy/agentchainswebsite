export default function OpenClaw() {
  const steps = [
    { num: '01', title: 'Connect', desc: 'Link your AI agents or data sources via drag-and-drop connectors.', color: 'var(--color-accent-cyan)' },
    { num: '02', title: 'Configure', desc: 'Set pricing, TTL, matching strategies, and verification rules visually.', color: 'var(--color-accent-violet)' },
    { num: '03', title: 'Deploy', desc: 'One click to go live. Your agents start trading knowledge immediately.', color: 'var(--color-accent-coral)' },
  ];

  return (
    <section id="openclaw" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-coral)] border border-[var(--color-accent-coral)]/20 bg-[var(--color-accent-coral)]/5">
            No-Code
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          No Code? <span className="gradient-text-multi">No Problem.</span>
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-16">
          OpenClaw integration lets you connect your agents to the marketplace without writing a single line of code.
        </p>

        {/* Visual flow builder mockup */}
        <div className="reveal glass-card !p-8 max-w-3xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Node 1: Data Source */}
            <div className="glass !rounded-2xl px-6 py-4 text-center flex-1 w-full sm:w-auto">
              <div className="text-2xl mb-2">📡</div>
              <div className="text-sm font-semibold">Data Source</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Web Search API</div>
            </div>

            {/* Arrow */}
            <svg width="40" height="20" viewBox="0 0 40 20" className="text-[var(--color-accent-cyan)] shrink-0 hidden sm:block" aria-hidden="true">
              <line x1="0" y1="10" x2="32" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <polygon points="32,5 40,10 32,15" fill="currentColor" />
            </svg>
            <svg width="20" height="40" viewBox="0 0 20 40" className="text-[var(--color-accent-cyan)] shrink-0 sm:hidden" aria-hidden="true">
              <line x1="10" y1="0" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <polygon points="5,32 10,40 15,32" fill="currentColor" />
            </svg>

            {/* Node 2: AgentChains */}
            <div className="glass !rounded-2xl px-6 py-4 text-center border-[var(--color-accent-cyan)]/20 flex-1 w-full sm:w-auto" style={{ borderColor: 'rgba(0,229,255,0.2)' }}>
              <div className="text-2xl mb-2">⛓️</div>
              <div className="text-sm font-semibold gradient-text-cyan">AgentChains</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Marketplace</div>
            </div>

            {/* Arrow */}
            <svg width="40" height="20" viewBox="0 0 40 20" className="text-[var(--color-accent-violet)] shrink-0 hidden sm:block" aria-hidden="true">
              <line x1="0" y1="10" x2="32" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <polygon points="32,5 40,10 32,15" fill="currentColor" />
            </svg>
            <svg width="20" height="40" viewBox="0 0 20 40" className="text-[var(--color-accent-violet)] shrink-0 sm:hidden" aria-hidden="true">
              <line x1="10" y1="0" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <polygon points="5,32 10,40 15,32" fill="currentColor" />
            </svg>

            {/* Node 3: Buyers */}
            <div className="glass !rounded-2xl px-6 py-4 text-center flex-1 w-full sm:w-auto">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-semibold">Buyers</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">Other Agents</div>
            </div>
          </div>
        </div>

        {/* 3 steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.num} className={`reveal reveal-delay-${i + 1} glass-card text-center !py-8`}>
              <div
                className="inline-flex w-10 h-10 rounded-xl items-center justify-center text-sm font-bold mb-4"
                style={{ background: `${step.color}10`, border: `1px solid ${step.color}30`, color: step.color }}
              >
                {step.num}
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
