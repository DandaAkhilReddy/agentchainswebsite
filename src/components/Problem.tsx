export default function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Red/amber ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,51,102,0.06)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Section label */}
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-coral)] border border-[var(--color-accent-coral)]/20 bg-[var(--color-accent-coral)]/5">
            The Problem
          </span>
        </div>

        {/* Big statement */}
        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center leading-tight mb-8">
          <span className="text-[var(--color-accent-coral)]">$2.4B</span> wasted daily on{' '}
          <br className="hidden sm:block" />
          duplicate AI computation
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-16">
          Every day, millions of AI agents independently compute identical results.
          The same web searches, the same code analyses, the same document summaries —
          all burning money for zero new information.
        </p>

        {/* Animated visualization: two agents making same call */}
        <div className="reveal max-w-3xl mx-auto mb-16">
          <div className="glass-card !p-8 relative">
            {/* Agent A */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-violet)]/10 border border-[var(--color-accent-violet)]/20 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-semibold">Agent A</div>
                  <div className="text-xs text-[var(--color-text-muted)]">10:42:01 AM</div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="code-block !py-3 !px-4 text-xs">
                  <span className="fn">search</span>(<span className="str">"Python 3.13 new features"</span>) → <span className="num">$0.003</span> <span className="cm">// 10 seconds</span>
                </div>
              </div>
            </div>

            {/* Divider with "meanwhile" */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-coral)]/30 to-transparent" />
              <span className="text-xs text-[var(--color-accent-coral)] font-semibold uppercase tracking-wider">10 seconds later</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-coral)]/30 to-transparent" />
            </div>

            {/* Agent B */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-cyan)]/10 border border-[var(--color-accent-cyan)]/20 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-semibold">Agent B</div>
                  <div className="text-xs text-[var(--color-text-muted)]">10:42:11 AM</div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="code-block !py-3 !px-4 text-xs">
                  <span className="fn">search</span>(<span className="str">"Python 3.13 new features"</span>) → <span className="num">$0.003</span> <span className="cm">// same query!</span>
                </div>
              </div>
            </div>

            {/* Money burning indicator */}
            <div className="mt-8 text-center py-4 rounded-xl bg-[var(--color-accent-coral)]/5 border border-[var(--color-accent-coral)]/10">
              <span className="text-[var(--color-accent-coral)] font-bold text-lg">$0.006 burned</span>
              <span className="text-[var(--color-text-muted)] text-sm ml-2">for zero new information</span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { value: '10M+', label: 'Duplicate queries per day', color: 'var(--color-accent-coral)' },
            { value: '$0.003', label: 'Wasted per duplicate call', color: 'var(--color-accent-amber)' },
            { value: '90%', label: 'Of agent work is repeated', color: 'var(--color-accent-coral)' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card text-center !py-6">
              <div className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-display)] mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
