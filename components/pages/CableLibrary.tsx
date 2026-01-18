"use client"

import { useState, useEffect } from "react"

export default function CableLibrary() {
  const [cables, setCables] = useState([
    { name: "Cat6 UTP", vop: "0.69c", impedance: "100 Ω" },
    { name: "Cat5e UTP", vop: "0.67c", impedance: "100 Ω" },
    { name: "RG6 Coaxial", vop: "0.82c", impedance: "75 Ω" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCable, setNewCable] = useState({ name: "", vop: "", impedance: "" })

  // 1. Load data from Local Storage on mount
  useEffect(() => {
    const savedCables = localStorage.getItem("cablescope_library")
    if (savedCables) {
      setCables(JSON.parse(savedCables))
    }
  }, [])

  // 2. Save data to Local Storage whenever 'cables' state changes
  useEffect(() => {
    localStorage.setItem("cablescope_library", JSON.stringify(cables))
  }, [cables])

  const handleAddCable = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCable.name || !newCable.vop) return

    setCables([...cables, newCable])
    setIsModalOpen(false)
    setNewCable({ name: "", vop: "", impedance: "" })
  }

  // Optional: Function to delete a cable
  const deleteCable = (indexToDelete: number) => {
    setCables(cables.filter((_, index) => index !== indexToDelete))
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cable Library</h1>
          <p className="text-xs text-muted-foreground mt-1">Stored locally on your device</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-xs font-bold transition-all"
        >
          + ADD NEW CABLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cables.map((cable, index) => (
          <div key={index} className="relative p-5 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 transition-all group">
            <button 
              onClick={() => deleteCable(index)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{cable.name}</h3>
            <div className="mt-4 flex justify-between text-xs font-mono text-muted-foreground">
              <span>VoP: {cable.vop}</span>
              <span>IMP: {cable.impedance}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal code remains the same as previous response */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <form onSubmit={handleAddCable} className="bg-[#0f0f0f] border border-border/50 p-6 rounded-2xl w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold text-foreground">Add New Cable Type</h2>
              <input 
                className="w-full bg-secondary/20 border border-border/50 rounded-lg p-2.5 text-sm text-white" 
                placeholder="Cable Name"
                onChange={(e) => setNewCable({...newCable, name: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  className="flex-1 bg-secondary/20 border border-border/50 rounded-lg p-2.5 text-sm text-white" 
                  placeholder="VoP (0.69c)"
                  onChange={(e) => setNewCable({...newCable, vop: e.target.value})}
                />
                <input 
                  className="flex-1 bg-secondary/20 border border-border/50 rounded-lg p-2.5 text-sm text-white" 
                  placeholder="Impedance"
                  onChange={(e) => setNewCable({...newCable, impedance: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2 border border-border/50 rounded text-sm">Cancel</button>
                <button type="submit" className="flex-1 p-2 bg-primary text-black font-bold rounded text-sm">Save</button>
              </div>
           </form>
         </div>
      )}
    </div>
  )
}