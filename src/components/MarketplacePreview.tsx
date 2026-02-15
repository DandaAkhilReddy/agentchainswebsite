import { useEffect, useState, useRef } from 'react';

interface Trade {
  id: number;
  query: string;
  price: string;
  time: string;
  status: 'listed' | 'sold';
}

const sampleQueries = [
  'Python 3.13 features',
  'React 19 server components',
  'Rust async patterns',
  'GPT-4o pricing comparison',
  'Docker Compose v3 reference',
  'TypeScript 5.4 decorators',
  'Kubernetes pod scheduling',
  'Next.js 15 App Router',
  'FastAPI WebSocket guide',
  'PostgreSQL indexing strategies',
  'Tailwind CSS v4 migration',
  'Redis caching patterns',
  'GraphQL N+1 solutions',
  'AWS Lambda cold starts',
  'OAuth 2.1 PKCE flow',
];

const randomPrice = () => (Math.random() * 0.008 + 0.001).toFixed(4);
const randomTime = () => `${Math.floor(Math.random() * 80 + 12)}ms`;

export default function MarketplacePreview() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState({ count: 238, volume: 142.5, avgTime: 47 });
  const idRef = useRef(0);

  useEffect(() => {
    // Initialize with a few trades
    const initial: Trade[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      query: sampleQueries[i % sampleQueries.length],
      price: '$' + randomPrice(),
      time: randomTime(),
      status: 'sold' as const,
    }));
    idRef.current = 5;
    setTrades(initial);

    const interval = setInterval(() => {
      idRef.current += 1;
      const newTrade: Trade = {
        id: idRef.current,
        query: sampleQueries[Math.floor(Math.random() * sampleQueries.length)],
        price: '$' + randomPrice(),
        time: randomTime(),
        status: Math.random() > 0.3 ? 'sold' : 'listed',
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 7)]);
      setStats((prev) => ({
        count: prev.count + 1,
        volume: +(prev.volume + parseFloat(newTrade.price.slice(1))).toFixed(2),
        avgTime: Math.floor((prev.avgTime * prev.count + parseInt(newTrade.time)) / (prev.count + 1)),
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="marketplace" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-secondary)]/50 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="reveal text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 bg-[var(--color-accent-cyan)]/5">
            Live Preview
          </span>
        </div>

        <h2 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6">
          The Marketplace in <span className="gradient-text-cyan">Action</span>
        </h2>

        <p className="reveal text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12">
          Watch knowledge being traded in real time. Every listing, every purchase — happening right now.
        </p>

        {/* Running ticker */}
        <div className="reveal glass rounded-xl px-6 py-4 mb-8 overflow-hidden">
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm font-[family-name:var(--font-mono)]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[var(--color-text-muted)]">Trades:</span>
              <span className="text-[var(--color-accent-cyan)] font-bold">{stats.count}</span>
            </span>
            <span className="hidden sm:inline text-[var(--color-text-muted)]">|</span>
            <span className="flex items-center gap-2">
              <span className="text-[var(--color-text-muted)]">Volume:</span>
              <span className="text-[var(--color-accent-cyan)] font-bold">${stats.volume.toFixed(2)}</span>
            </span>
            <span className="hidden sm:inline text-[var(--color-text-muted)]">|</span>
            <span className="flex items-center gap-2">
              <span className="text-[var(--color-text-muted)]">Avg delivery:</span>
              <span className="text-[var(--color-accent-cyan)] font-bold">{stats.avgTime}ms</span>
            </span>
          </div>
        </div>

        {/* Trade feed */}
        <div className="reveal glass-card !p-0 overflow-hidden max-w-3xl mx-auto" role="log" aria-label="Live marketplace trades">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
            <span className="flex-1">Query</span>
            <span className="w-24 text-right">Price</span>
            <span className="w-20 text-right">Time</span>
            <span className="w-20 text-right">Status</span>
          </div>

          {/* Trades */}
          <div className="divide-y divide-white/5">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="flex-1 text-sm font-medium truncate pr-4">{trade.query}</span>
                <span className="w-24 text-right text-sm font-[family-name:var(--font-mono)] text-[var(--color-accent-cyan)]">
                  {trade.price}
                </span>
                <span className="w-20 text-right text-sm font-[family-name:var(--font-mono)] text-[var(--color-text-muted)]">
                  {trade.time}
                </span>
                <span className="w-20 text-right">
                  {trade.status === 'sold' ? (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                      SOLD
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20">
                      LISTED
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
