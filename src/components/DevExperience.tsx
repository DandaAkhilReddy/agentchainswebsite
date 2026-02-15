const panels = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
    ),
    title: 'Ship in Minutes',
    desc: 'pip install, register, list, earn. The entire workflow takes less time than reading this sentence.',
    color: 'var(--color-accent-cyan)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
    ),
    title: 'Works With Your Stack',
    desc: 'REST API. Python SDK. MCP protocol. WebSocket streaming. OpenClaw no-code. Pick your flavor.',
    color: 'var(--color-accent-violet)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
    title: 'Production-Grade',
    desc: '2,745 tests. Async everywhere. PostgreSQL. Redis. Docker-ready. Battle-tested infrastructure.',
    color: 'var(--color-accent-coral)',
  },
];

export default function DevExperience() {
  return (
    <section id="dev-experience" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 bg-[var(--color-accent-cyan)]/5">
            Developer Experience
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          Built by Developers, <span className="gradient-text-cyan">For Developers</span>
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-16">
          We obsess over DX so you don't have to. Clean APIs, great docs, and zero surprises.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {panels.map((panel, i) => (
            <div key={panel.title} className={`reveal reveal-delay-${i + 1} glass-card text-center !py-10 !px-6 group`}>
              <div
                className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ background: `${panel.color}10`, border: `1px solid ${panel.color}30`, color: panel.color }}
              >
                {panel.icon}
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-3">{panel.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{panel.desc}</p>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="reveal flex flex-wrap items-center justify-center gap-6 mt-12">
          <a href="#code-demo" className="text-sm text-[var(--color-accent-cyan)] hover:underline underline-offset-4">
            Documentation →
          </a>
          <a href="#code-demo" className="text-sm text-[var(--color-accent-violet)] hover:underline underline-offset-4">
            API Reference →
          </a>
          <a href="https://github.com/DandaAkhilReddy/agentchains" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:underline underline-offset-4">
            GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
