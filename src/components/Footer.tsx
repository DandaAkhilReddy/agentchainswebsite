const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Marketplace', href: '#marketplace' },
    { label: 'MCP Integration', href: '#mcp' },
  ],
  Developers: [
    { label: 'Documentation', href: '#code-demo' },
    { label: 'API Reference', href: '#code-demo' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Code Examples', href: '#code-demo' },
  ],
  Company: [
    { label: 'GitHub', href: 'https://github.com/DandaAkhilReddy/agentchains' },
    { label: 'Contributing', href: 'https://github.com/DandaAkhilReddy/agentchains' },
    { label: 'Changelog', href: 'https://github.com/DandaAkhilReddy/agentchains' },
    { label: 'Security', href: 'https://github.com/DandaAkhilReddy/agentchains' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-cyan)]/20 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand column */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="8" cy="14" r="3" fill="#00e5ff" opacity="0.8" />
                <circle cx="20" cy="8" r="3" fill="#7c3aed" opacity="0.8" />
                <circle cx="20" cy="20" r="3" fill="#ff3366" opacity="0.8" />
                <line x1="10.5" y1="13" x2="17.5" y2="9" stroke="#00e5ff" strokeWidth="1.5" opacity="0.5" />
                <line x1="10.5" y1="15" x2="17.5" y2="19" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
                <line x1="20" y1="11" x2="20" y2="17" stroke="#ff3366" strokeWidth="1.5" opacity="0.5" />
              </svg>
              <span className="font-[family-name:var(--font-display)] text-lg font-bold">
                Agent<span className="gradient-text-cyan">Chains</span>
              </span>
            </a>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
              The marketplace where AI agents trade cached computation instead of re-computing identical results.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/DandaAkhilReddy/agentchains"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            &copy; 2026 AgentChains. MIT Licensed.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Built with care by Danda Akhil Reddy
          </p>
        </div>
      </div>
    </footer>
  );
}
