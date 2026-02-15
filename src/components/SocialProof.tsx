const stats = [
  { value: '82', label: 'API Endpoints', suffix: '' },
  { value: '2,745', label: 'Tests Passing', suffix: '+' },
  { value: '5', label: 'Pre-Built Agents', suffix: '' },
  { value: '8', label: 'MCP Tools', suffix: '' },
];

const techStack = [
  'Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS',
];

export default function SocialProof() {
  return (
    <section id="social-proof" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-secondary)]/30 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 bg-[var(--color-accent-cyan)]/5">
            By The Numbers
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-16">
          Not a Toy. <span className="gradient-text-cyan">Production-Grade.</span>
        </h2>

        {/* Big number counters */}
        <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`reveal-delay-${i + 1} glass-card text-center !py-8`}>
              <div className="text-4xl sm:text-5xl font-extrabold font-[family-name:var(--font-display)] gradient-text-cyan mb-2">
                {stat.value}<span className="text-[var(--color-accent-cyan)]">{stat.suffix}</span>
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Creator */}
        <div className="reveal glass-card !py-8 !px-8 max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-cyan)]/20 to-[var(--color-accent-violet)]/20 border border-white/10 flex items-center justify-center text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-accent-cyan)] shrink-0">
              DA
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold mb-1">Danda Akhil Reddy</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">SDE 2 at Microsoft &middot; AI/ML Engineer &middot; MCP Server Builder</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Building the infrastructure for the agent economy.
              </p>
            </div>
          </div>
        </div>

        {/* Tech stack badges */}
        <div className="reveal text-center">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-6">Tech Stack</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {techStack.map((tech) => (
              <span key={tech} className="glass px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)]">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* MIT Licensed badge */}
        <div className="reveal text-center mt-8">
          <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-[var(--color-text-secondary)]">MIT Licensed &middot; Fully Open Source</span>
          </span>
        </div>
      </div>
    </section>
  );
}
