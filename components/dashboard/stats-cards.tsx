interface StatsCardsProps {
  expenseThisWeek: number
  expenseToday: number
  incomeThisWeek: number
}

export function StatsCards({ expenseThisWeek, expenseToday, incomeThisWeek }: StatsCardsProps) {
  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000)
      return "Rp\u00a0" + (abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0jt"
    if (abs >= 1_000)
      return "Rp\u00a0" + (abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + "\u00a0rb"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n)
  }

  const items = [
    {
      label: "Pengeluaran minggu ini",
      period: "Senin — Minggu berjalan",
      value: fmt(expenseThisWeek),
      valueClass: "text-slate-900",
    },
    {
      label: "Pengeluaran hari ini",
      period: "Transaksi keluar hari ini",
      value: fmt(expenseToday),
      valueClass: "text-slate-900",
    },
    {
      label: "Pemasukan minggu ini",
      period: "Senin — Minggu berjalan",
      value: fmt(incomeThisWeek),
      valueClass: "text-emerald-600",
    },
  ]

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-5">
            <p className="text-xs font-medium text-slate-400">{item.label}</p>
            <p className={`mt-2 text-xl font-semibold tracking-tight ${item.valueClass}`}>
              {item.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{item.period}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
