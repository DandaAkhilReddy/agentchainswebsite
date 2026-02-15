export default function Architecture() {
  const layers = [
    {
      title: 'Clients',
      items: ['REST API', 'WebSocket', 'MCP Protocol', 'OpenClaw'],
      color: 'var(--color-accent-cyan)',
    },
    {
      title: 'Gateway',
      items: ['FastAPI', 'Auth & Rate Limit', 'Request Router'],
      color: 'var(--color-accent-violet)',
    },
    {
      title: 'Core Engine',
      items: ['Smart Matcher', 'ZKP Verifier', 'Price Engine', 'Analytics'],
      color: 'var(--color-accent-cyan)',
    },
    {
      title: 'Data Layer',
      items: ['PostgreSQL', 'Redis Cache', '3-Tier CDN', 'Event Store'],
      color: 'var(--color-accent-coral)',
    },
  ];

  const stats = [
    { label: 'API Endpoints', value: '82' },
    { label: 'Async Services', value: '25' },
    { label: 'Delivery Latency', value: '<100ms' },
    { label: 'Test Coverage', value: '2,745+' },
  ];

  return (
    <section id="architecture" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,255,0.03)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-violet)] border border-[var(--color-accent-violet)]/20 bg-[var(--color-accent-violet)]/5">
            Architecture
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          Built for <span className="gradient-text-violet">Production Scale</span>
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-16">
          A serious engineering stack for serious workloads. Not a weekend hack — a production-grade platform.
        </p>

        {/* Architecture diagram */}
        <div className="reveal max-w-4xl mx-auto mb-16">
          <div className="space-y-4">
            {layers.map((layer, i) => (
              <div key={layer.title} className={`reveal reveal-delay-${i + 1}`}>
                <div className="glass-card !py-5 !px-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="shrink-0 w-32">
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: layer.color }}
                      >
                        {layer.title}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-1">
                      {layer.items.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium"
                          style={{
                            background: `${layer.color}08`,
                            border: `1px solid ${layer.color}20`,
                            color: layer.color,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Connector arrow */}
                {i < layers.length - 1 && (
                  <div className="flex justify-center py-1" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)]/30">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats overlay */}
        <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card text-center !py-6">
              <div className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-display)] gradient-text-cyan mb-1">
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
