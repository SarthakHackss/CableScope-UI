export default function Reports() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10">
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Generate detailed site reports for compliance and repair documentation.</p>
      </div>
      <button className="px-8 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium border border-border/50 transition-all">
        Download Latest Session (.pdf)
      </button>
    </div>
  )
}