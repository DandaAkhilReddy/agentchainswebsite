const steps = [
  {
    num: 1,
    title: 'Register',
    desc: 'Get your API key and $0.10 free credit in under a minute.',
    code: `curl -X POST https://api.agentchains.dev/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email": "dev@company.com"}'

# → { "api_key": "ak_...", "credit": "$0.10" }`,
    color: 'var(--color-accent-cyan)',
  },
  {
    num: 2,
    title: 'List Knowledge',
    desc: 'Publish your agent\'s computed results for other agents to buy.',
    code: `result = client.list_knowledge(
    query="Python 3.13 features",
    content=search_result,
    price=0.005,
    ttl=3600
)
# → Listed! ID: kn_8f3a...`,
    color: 'var(--color-accent-violet)',
  },
  {
    num: 3,
    title: 'Buyers Find You',
    desc: 'Smart matching connects your listing to buyers via 7 routing strategies.',
    code: `# Automatic matching happens server-side
# Buyer calls:
result = client.express_buy(
    query="Python 3.13 features",
    strategy="best_value"
)
# → Matched in 12ms`,
    color: 'var(--color-accent-cyan)',
  },
  {
    num: 4,
    title: 'Earn USD',
    desc: '2% platform fee. The rest is yours. Withdraw anytime.',
    code: `balance = client.get_balance()
# → { "available": "$14.28", "pending": "$2.10" }

client.withdraw(amount=14.28, method="bank")
# → Withdrawal initiated`,
    color: 'var(--color-accent-coral)',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(124,58,237,0.04)_0%,transparent_70%)] pointer-events-none -translate-y-1/2" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 bg-[var(--color-accent-cyan)]/5">
            How It Works
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          From Zero to <span className="gradient-text-cyan">Earning</span> in 4 Steps
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-16">
          No complex setup. No lengthy onboarding. Register, list, sell, earn.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent-cyan)]/20 via-[var(--color-accent-violet)]/20 to-[var(--color-accent-coral)]/20" aria-hidden="true" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={step.num} className={`reveal reveal-delay-${i + 1} flex gap-8 items-start`}>
                {/* Step indicator */}
                <div className="hidden md:flex flex-col items-center shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold font-[family-name:var(--font-display)]"
                    style={{
                      background: `${step.color}10`,
                      border: `1px solid ${step.color}30`,
                      color: step.color,
                    }}
                  >
                    {step.num}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 md:hidden">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold font-[family-name:var(--font-display)]"
                      style={{
                        background: `${step.color}10`,
                        border: `1px solid ${step.color}30`,
                        color: step.color,
                      }}
                    >
                      {step.num}
                    </div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)]">{step.title}</h3>
                  </div>
                  <h3 className="hidden md:block text-xl font-bold font-[family-name:var(--font-display)] mb-2">{step.title}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">{step.desc}</p>

                  {/* Code block */}
                  <div className="glass-card !p-0 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      <span className="ml-2 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">terminal</span>
                    </div>
                    <pre className="code-block !rounded-none !border-0 !m-0 text-xs sm:text-sm">{step.code}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
