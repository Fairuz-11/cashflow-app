"use client"

interface HeroCardProps {
  balance: number
  changePercent: string
}

export function HeroCard({ balance, changePercent }: HeroCardProps) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl p-6 text-white">
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute right-16 top-16 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-2xl" />
      
      {/* Mini chart decoration */}
      <div className="absolute right-6 top-6 opacity-30">
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <path d="M0 40 Q 20 30, 40 35 T 80 25 T 120 20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M0 45 Q 20 35, 40 40 T 80 30 T 120 25" stroke="currentColor" strokeWidth="3" fill="none"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-300">Total Balance</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        
        <div className="mb-3">
          <h2 className="text-4xl font-bold tracking-tight">{fmt(balance)}</h2>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            parseFloat(changePercent) >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {parseFloat(changePercent) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(changePercent))}%
          </div>
          <span className="text-gray-400">vs last month</span>
        </div>
      </div>

      {/* Dollar icon */}
      <div className="absolute right-8 bottom-6 w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  )
}
