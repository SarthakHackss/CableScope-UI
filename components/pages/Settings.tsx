export default function Settings() {
  return (
    <div className="p-8 max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
      
      <div className="space-y-6">
        <section className="p-6 rounded-xl border border-border/50 bg-card/20 space-y-4">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Hardware Interface</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Pulse Intensity (V)</label>
              <input type="range" className="w-full accent-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Sampling Rate</label>
              <select className="w-full bg-background border border-border/50 rounded p-2 text-sm text-foreground">
                <option>500 MS/s</option>
                <option>1 GS/s</option>
              </select>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-xl border border-border/50 bg-card/20 space-y-4">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Network Configuration</h2>
          <div className="flex gap-4">
            <input type="text" placeholder="192.168.1.105" className="flex-1 bg-background border border-border/50 rounded p-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded text-xs font-bold">RECONNECT</button>
          </div>
        </section>
      </div>
    </div>
  )
}