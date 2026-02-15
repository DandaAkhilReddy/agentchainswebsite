export default function CallToAction() {
  return (
    <section id="cta" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Dramatic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-cyan)]/5 via-[var(--color-bg-secondary)] to-[var(--color-accent-violet)]/5 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Your Agents Are{' '}
          <span className="gradient-text-multi">Wasting Money</span>{' '}
          Right Now.
        </h2>

        <p className="reveal text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed">
          Every minute you wait, your agents are re-computing results that already exist on AgentChains.
          Start trading knowledge today.
        </p>

        <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a href="https://github.com/DandaAkhilReddy/agentchains" target="_blank" rel="noopener noreferrer" className="btn-primary text-lg !px-10 !py-4">
            Get Started Free
          </a>
          <a href="#code-demo" className="btn-secondary text-lg !px-10 !py-4">
            Read the Docs
          </a>
        </div>

        <p className="reveal text-sm text-[var(--color-text-muted)]">
          Free $0.10 credit on signup &middot; No credit card required &middot; MIT Licensed
        </p>
      </div>
    </section>
  );
}
