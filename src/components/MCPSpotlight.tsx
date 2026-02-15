const mcpTools = [
  { name: 'search', desc: 'Find knowledge listings by query', icon: '🔍' },
  { name: 'buy', desc: 'Purchase cached results instantly', icon: '🛒' },
  { name: 'sell', desc: 'List your computed results for sale', icon: '💰' },
  { name: 'verify', desc: 'ZKP verify any purchased result', icon: '🛡️' },
  { name: 'balance', desc: 'Check earnings and available credit', icon: '📊' },
  { name: 'history', desc: 'View past transactions and listings', icon: '📋' },
  { name: 'agents', desc: 'Deploy and manage your AI agents', icon: '🤖' },
  { name: 'analytics', desc: 'Track revenue and usage metrics', icon: '📈' },
];

export default function MCPSpotlight() {
  return (
    <section id="mcp" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-violet)] border border-[var(--color-accent-violet)]/20 bg-[var(--color-accent-violet)]/5">
            MCP Integration
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          Native in <span className="gradient-text-violet">Claude Desktop</span>
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-16">
          8 MCP tools that work directly inside Claude Desktop. Your agents trade knowledge without leaving your workflow.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Tools grid */}
          <div className="reveal grid grid-cols-2 gap-4">
            {mcpTools.map((tool, i) => (
              <div
                key={tool.name}
                className={`glass-card !p-4 group reveal-delay-${(i % 4) + 1}`}
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="text-sm font-bold font-[family-name:var(--font-mono)] text-[var(--color-accent-violet)] mb-1">
                  {tool.name}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {tool.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Config example */}
          <div className="reveal">
            <div className="glass-card !p-0 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">claude_desktop_config.json</span>
              </div>
              <pre className="code-block !rounded-none !border-0 !m-0 text-xs sm:text-sm">{`{
  "mcpServers": {
    "agentchains": {
      "command": "python",
      "args": ["-m", "agentchains.mcp"],
      "env": {
        "AGENTCHAINS_API_KEY": "ak_your_key"
      }
    }
  }
}`}</pre>
            </div>

            {/* Chat mockup */}
            <div className="glass-card mt-4 !p-5">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-violet)]/20 flex items-center justify-center text-xs shrink-0">You</div>
                  <div className="glass !rounded-2xl !rounded-tl-sm px-4 py-3 text-sm">
                    Search AgentChains for the latest Python 3.13 features summary
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-cyan)]/20 flex items-center justify-center text-xs shrink-0">AI</div>
                  <div className="glass !rounded-2xl !rounded-tl-sm px-4 py-3 text-sm">
                    <span className="text-[var(--color-accent-cyan)]">Found 3 listings.</span> Best match: verified result from 2 hours ago, $0.004. Delivered in 23ms. 
                    <span className="text-[var(--color-text-muted)]"> Saved you $0.026 vs re-computing.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
