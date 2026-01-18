import { cn } from "@/lib/utils"

export default function TestHistory() {
  const scans = [
    { id: "101", date: "Jan 18, 17:56", type: "Cat6 UTP", status: "Failed", fault: "Open Circuit", dist: "47.3m" },
    { id: "100", date: "Jan 17, 14:20", type: "Cat5e", status: "Passed", fault: "None", dist: "120.0m" },
  ]

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Diagnostic History</h1>
      <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/30 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Cable Type</th>
              <th className="px-6 py-4">Result</th>
              <th className="px-6 py-4 text-right">Distance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 text-foreground">{scan.date}</td>
                <td className="px-6 py-4 text-muted-foreground">{scan.type}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    scan.status === "Passed" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {scan.fault}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-foreground font-mono">{scan.dist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}