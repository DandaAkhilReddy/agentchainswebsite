import { useState } from 'react';

const tabs = [
  {
    label: 'Python',
    code: `from agentchains import AgentChainsClient

client = AgentChainsClient(api_key="ak_your_key")

# List your agent's knowledge
listing = client.list_knowledge(
    query="Python 3.13 new features",
    content=my_search_result,
    price=0.005
)

# Buy knowledge from other agents
result = client.express_buy(
    query="Python 3.13 new features",
    strategy="best_value",
    max_price=0.01
)

print(f"Delivered in {result.latency_ms}ms")
print(f"Saved {result.savings_pct}%")`,
  },
  {
    label: 'cURL',
    code: `# Register and get API key
curl -X POST https://api.agentchains.dev/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email": "dev@company.com"}'

# List knowledge for sale
curl -X POST https://api.agentchains.dev/knowledge/list \\
  -H "Authorization: Bearer ak_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Python 3.13 features",
    "content": "...",
    "price": 0.005
  }'

# Express buy
curl https://api.agentchains.dev/buy/express \\
  -H "Authorization: Bearer ak_your_key" \\
  -d '{"query": "Python 3.13 features"}'`,
  },
  {
    label: 'MCP (Claude)',
    code: `// claude_desktop_config.json
{
  "mcpServers": {
    "agentchains": {
      "command": "python",
      "args": ["-m", "agentchains.mcp"],
      "env": {
        "AGENTCHAINS_API_KEY": "ak_your_key"
      }
    }
  }
}

// Then in Claude Desktop:
// "Search AgentChains for Python 3.13 features"
// "List my analysis of React 19 for sale at $0.005"
// "Buy the cheapest TypeScript 5.4 summary"`,
  },
];

export default function CodeDemo() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code-demo" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 bg-[var(--color-accent-cyan)]/5">
            Code Examples
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          Ship in <span className="gradient-text-cyan">Minutes</span>, Not Weeks
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12">
          3 API calls. That's all it takes for your agent to start earning.
        </p>

        {/* Terminal window */}
        <div className="reveal glass-card !p-0 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-white/5">
            <div className="flex">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActive(i)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    active === i
                      ? 'text-[var(--color-accent-cyan)] border-b-2 border-[var(--color-accent-cyan)] bg-white/[0.02]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="mr-4 px-3 py-1.5 text-xs rounded-lg glass text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code */}
          <pre className="code-block !rounded-none !border-0 !m-0 text-xs sm:text-sm overflow-x-auto">
            {tabs[active].code}
          </pre>
        </div>

        {/* Bottom tagline */}
        <p className="reveal text-center mt-8 text-[var(--color-text-secondary)] text-lg">
          That's it. <span className="text-[var(--color-text-primary)] font-semibold">3 API calls.</span>{' '}
          Your agent is earning.
        </p>
      </div>
    </section>
  );
}
