import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#code-demo' },
  { label: 'GitHub', href: 'https://github.com/DandaAkhilReddy/agentchains' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-strong py-3 shadow-lg shadow-black/20'
            : 'py-5 bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group" aria-label="AgentChains Home">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="transition-transform group-hover:scale-110">
              <circle cx="8" cy="14" r="3" fill="#00e5ff" opacity="0.8" />
              <circle cx="20" cy="8" r="3" fill="#7c3aed" opacity="0.8" />
              <circle cx="20" cy="20" r="3" fill="#ff3366" opacity="0.8" />
              <line x1="10.5" y1="13" x2="17.5" y2="9" stroke="#00e5ff" strokeWidth="1.5" opacity="0.5" />
              <line x1="10.5" y1="15" x2="17.5" y2="19" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
              <line x1="20" y1="11" x2="20" y2="17" stroke="#ff3366" strokeWidth="1.5" opacity="0.5" />
            </svg>
            <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
              Agent<span className="gradient-text-cyan">Chains</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a href="#cta" className="btn-primary !py-2.5 !px-6 !text-sm">
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Nav bottom glow */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-cyan)]/30 to-transparent" />
        )}
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 glass-strong flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent-cyan)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a href="#cta" onClick={() => setMobileOpen(false)} className="btn-primary mt-4">
            Get Started
          </a>
        </div>
      )}
    </>
  );
}
